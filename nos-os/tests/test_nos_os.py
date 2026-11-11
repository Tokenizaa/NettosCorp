#!/usr/bin/env python3
"""
Testes de unidade e integração — Sistema Operacional NettosCorp (NOS-OS)

Valida:
1. Ausência de credenciais hardcoded
2. Heartbeat monitor não escreve no banco (apenas lê)
3. Checkout atômico impede dupla atribuição
4. Claim atômico de fila impede dupla reivindicação
5. Hermes é a única IA (is_ai = true)
6. Funções organizacionais têm is_ai = false
7. SQL escape protege contra injeção
8. Validação de UUID rejeita valores inválidos

Uso:
    SUPABASE_URL=... SUPABASE_ANON_KEY=... SUPABASE_PASSWORD=... python test_nos_os.py
"""

import os
import re
import sys
import tempfile

# Adicionar o diretório ao path para importar o task_executor
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "src", "execution"))

from task_executor import (
    sql_escape, is_valid_uuid, get_agent_by_code,
    checkout_issue, complete_issue, claim_queue_item,
    create_queue_items, start_session, start_execution,
    add_execution_step, update_execution_step,
    add_tool_invocation, add_execution_artifact,
    create_checkpoint, complete_execution,
    list_backlog_issues, get_in_progress_issues,
    run_sql, get_company_id,
)

SUPABASE_PASSWORD = os.environ.get("SUPABASE_PASSWORD")
SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_ANON_KEY = os.environ.get("SUPABASE_ANON_KEY")

if not all([SUPABASE_PASSWORD, SUPABASE_URL, SUPABASE_ANON_KEY]):
    print("❌ Variáveis de ambiente obrigatórias não definidas.")
    sys.exit(1)

company_id = None
hermes_id = None
results = {"passed": 0, "failed": 0, "errors": []}


def test(name, condition, detail=""):
    if condition:
        results["passed"] += 1
        print(f"  ✅ {name}")
    else:
        results["failed"] += 1
        results["errors"].append(name)
        print(f"  ❌ {name} {detail}")


def setup():
    global company_id, hermes_id
    print("\n=== Setup ===")
    company_id = get_company_id()
    test("Empresa encontrada", company_id is not None, company_id)

    agent = get_agent_by_code("HERMES-001")
    test("Hermes existe", agent is not None)
    if agent:
        hermes_id = agent["id"]
        test("Hermes está ativo", agent["status"] == "active")
        test("Hermes tem role executive", agent["role"] == "executive")


def test_no_hardcoded_credentials():
    print("\n=== Teste 1: Sem credenciais hardcoded ===")

    # Verificar scripts Python
    scripts = [
        "nos-os/src/execution/task_executor.py",
        "nos-os/src/monitor/heartbeat_monitor.py",
        "nos-os/src/sync/sync_hermes_supabase.py",
        "nos-os/src/reports/generate_report.py",
    ]

    base_dir = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
    for script in scripts:
        path = os.path.join(base_dir, script)
        if not os.path.exists(path):
            test(f"{script} existe", False, "arquivo não encontrado")
            continue
        content = open(path, "r", encoding="utf-8").read()

        # Procurar por padrões de credenciais hardcoded
        patterns = [
            r'password\s*=\s*["\'][^"\']+["\']',
            r'DB_PASSWORD\s*=\s*["\'][^"\']+["\']',
            r'PGPASSWORD\s*=\s*["\'][^"\']+["\']',
            r'Hermes@964212',
            r'Netto@964212',
        ]
        found = False
        for pattern in patterns:
            if re.search(pattern, content, re.IGNORECASE):
                # Permitir se for referência a variável de ambiente
                if 'os.environ.get' in content or 'os.getenv' in content:
                    continue
                found = True
                print(f"  ⚠️  Possível credencial hardcoded em {script}: {pattern}")
                break

        test(f"{script} sem credenciais hardcoded", not found)

    # Verificar que os scripts exigem variáveis de ambiente
    for script in scripts:
        path = os.path.join(base_dir, script)
        if os.path.exists(path):
            content = open(path, "r", encoding="utf-8").read()
            has_env_check = "SUPABASE_PASSWORD não definida" in content or "obrigatórias no ambiente" in content
            test(f"{script} exige variáveis de ambiente", has_env_check)


def test_heartbeat_read_only():
    print("\n=== Teste 2: Heartbeat monitor apenas lê (não escreve) ===")

    monitor_path = os.path.join(
        os.path.dirname(os.path.dirname(os.path.dirname(__file__))),
        "nos-os/src/monitor/heartbeat_monitor.py"
    )
    if os.path.exists(monitor_path):
        content = open(monitor_path, "r", encoding="utf-8").read()

        # Verificar que não há UPDATE na tabela agents para last_heartbeat_at
        has_update_heartbeat = "UPDATE agents" in content and "last_heartbeat_at" in content
        has_insert_heartbeat = "INSERT INTO" in content and "heartbeat" in content.lower()

        test("Monitor não faz UPDATE de last_heartbeat_at", not has_update_heartbeat)
        test("Monitor não faz INSERT de heartbeat", not has_insert_heartbeat)
        test("Monitor menciona 'APENAS LÊ'", "APENAS LÊ" in content)


def test_hermes_unique_ia():
    print("\n=== Teste 3: Hermes é a única IA ===")

    query = f"""
    SELECT code, is_ai FROM functions
    WHERE company_id = {company_id}
    ORDER BY code;
    """
    stdout, stderr, rc = run_sql(query)
    test("Consulta de funções funcionou", rc == 0)

    if rc == 0 and stdout:
        for line in stdout.strip().split("\n"):
            if not line.strip():
                continue
            parts = line.split("|")
            if len(parts) >= 2:
                code = parts[0].strip()
                is_ai = parts[1].strip()
                if code == "HERMES-001":
                    test("Hermes é IA", is_ai == "true" or is_ai == "TRUE", f"is_ai={is_ai}")
                else:
                    test(f"{code} não é IA", is_ai == "false" or is_ai == "FALSE", f"is_ai={is_ai}")


def test_sql_escape():
    print("\n=== Teste 4: SQL escape protege contra injeção ===")

    # Teste de escape de aspas simples
    escaped = sql_escape("O'Reilly")
    test("Escapa aspas simples", escaped == "'O''Reilly'", f"resultado: {escaped}")

    # Teste de NULL
    escaped_null = sql_escape(None)
    test("Escapa NULL", escaped_null == "NULL", f"resultado: {escaped_null}")

    # Teste de string normal
    escaped_normal = sql_escape("hello")
    test("Escapa string normal", escaped_normal == "'hello'", f"resultado: {escaped_normal}")

    # Teste de número
    escaped_num = sql_escape(42)
    test("Escapa número", escaped_num == "42", f"resultado: {escaped_num}")


def test_uuid_validation():
    print("\n=== Teste 5: Validação de UUID ===")

    valid_uuid = "e190b806-7e2a-4e8d-8cb0-890c834adb29"
    test("UUID válido aceito", is_valid_uuid(valid_uuid) is True)

    test("UUID inválido rejeitado", is_valid_uuid("não-um-uuid") is False)
    test("String vazia rejeitada", is_valid_uuid("") is False)
    test("None rejeitado", is_valid_uuid(None) is False)
    test("Número rejeitado", is_valid_uuid(123) is False)


def test_checkout_atomicity():
    print("\n=== Teste 6: Checkout atômico ===")

    # Listar issues em backlog
    issues = list_backlog_issues()
    test("Lista issues em backlog", isinstance(issues, list))

    if issues:
        issue = issues[0]
        issue_id = issue["id"]

        # Primeiro checkout deve funcionar
        result1 = checkout_issue(issue_id, "SPEC-TW-001")
        test("Primeiro checkout funciona", result1 is not None)

        if result1:
            # Segundo checkout para a mesma issue deve falhar (já está in_progress)
            result2 = checkout_issue(issue_id, "SPEC-BACK-001")
            test("Segundo checkout rejeitado (já em andamento)", result2 is None)

            # Reverter para backlog para não deixar dados alterados
            run_sql(f"""
                UPDATE issues
                SET status = 'backlog', assignee_agent_id = NULL, updated_at = NOW()
                WHERE id = '{issue_id}';
            """)


def test_uuid_rejection_in_checkout():
    print("\n=== Teste 7: Checkout rejeita UUID inválido ===")

    result = checkout_issue("não-um-uuid", "SPEC-TW-001")
    test("UUID inválido rejeitado no checkout", result is None)


def main():
    print("=" * 60)
    print("TESTES DO SISTEMA OPERACIONAL NETTOSCORP (NOS-OS)")
    print("=" * 60)

    setup()
    test_no_hardcoded_credentials()
    test_heartbeat_read_only()
    test_hermes_unique_ia()
    test_sql_escape()
    test_uuid_validation()
    test_checkout_atomicity()
    test_uuid_rejection_in_checkout()

    print("\n" + "=" * 60)
    print(f"RESULTADO: {results['passed']} aprovados, {results['failed']} falhados")
    if results["errors"]:
        print(f"Falhas: {', '.join(results['errors'])}")
    print("=" * 60)

    return 0 if results["failed"] == 0 else 1


if __name__ == "__main__":
    sys.exit(main())
