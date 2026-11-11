#!/usr/bin/env python3
"""
Execução de Tarefas — Sistema Operacional NettosCorp (NOS-OS)

Implementa o ciclo de execução de tarefas com:
- Fila ordenada por prioridade
- Checkout atômico (uma tarefa é atribuída a uma única função por vez)
- Persistência no Supabase (tabela issues)
- Retomada de tarefas abandonadas (stale in_progress)
- Prevenção de duplicidade (uma issue só tem um assignee por vez)
- Auditoria completa de todas as mudanças de status

Uso:
    python task_executor.py --assign --agent-code NET-AG-001
    python task_executor.py --complete --issue-id <uuid>
    python task_executor.py --list-backlog
    python task_executor.py --audit
"""

import os
import sys
import json
import subprocess
import tempfile
from datetime import datetime, timedelta
from uuid import uuid4

# Configuração do Supabase (obrigatória via variáveis de ambiente)
SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_ANON_KEY = os.environ.get("SUPABASE_ANON_KEY")
DB_PASSWORD = os.environ.get("SUPABASE_PASSWORD")

if not SUPABASE_URL or not SUPABASE_ANON_KEY:
    raise RuntimeError("SUPABASE_URL e SUPABASE_ANON_KEY são obrigatórios no ambiente.")
if not DB_PASSWORD:
    raise RuntimeError("SUPABASE_PASSWORD não definida no ambiente. Não use credenciais hardcoded.")


def run_sql(query, fetch=True):
    """Executa uma consulta SQL no Supabase via psql."""
    with tempfile.NamedTemporaryFile(mode='w', suffix='.sql', delete=False, encoding='utf-8') as f:
        f.write(query)
        temp_file = f.name

    try:
        env = os.environ.copy()
        env["PGPASSWORD"] = DB_PASSWORD

        result = subprocess.run(
            [
                "psql",
                "-h", "db.udeglcdloehagljrrukj.supabase.co",
                "-p", "5432",
                "-U", "postgres",
                "-d", "postgres",
                "-f", temp_file,
                "-t",
                "-A",
            ],
            env=env,
            capture_output=True,
            text=True,
            timeout=30
        )

        return result.stdout.strip(), result.stderr.strip(), result.returncode
    finally:
        os.unlink(temp_file)


def get_company_id():
    """Retorna o ID da empresa NettosCorp."""
    query = """
    SELECT id FROM companies WHERE issue_prefix = 'NET' ORDER BY created_at DESC LIMIT 1;
    """
    stdout, stderr, rc = run_sql(query)
    if rc != 0 or not stdout.strip():
        raise RuntimeError(f"Não foi possível encontrar a empresa NettosCorp: {stderr}")
    return stdout.strip()


def get_agent_by_code(code):
    """Obtém um agente/código de função pelo código."""
    query = f"""
    SELECT id, code, name, role, title, status, reports_to, capabilities
    FROM agents
    WHERE company_id = (SELECT id FROM companies WHERE issue_prefix = 'NET' ORDER BY created_at DESC LIMIT 1)
    AND code = '{code}';
    """
    stdout, stderr, rc = run_sql(query)
    if rc != 0 or not stdout.strip():
        return None
    parts = stdout.strip().split("|")
    if len(parts) < 8:
        return None
    return {
        "id": parts[0].strip(),
        "code": parts[1].strip(),
        "name": parts[2].strip(),
        "role": parts[3].strip(),
        "title": parts[4].strip(),
        "status": parts[5].strip(),
        "reports_to": parts[6].strip(),
        "capabilities": parts[7].strip(),
    }


def list_backlog_issues():
    """Lista todas as issues em backlog, ordenadas por prioridade e data de criação."""
    query = """
    SELECT i.id, i.title, i.description, i.priority, i.created_at, i.assignee_agent_id,
           a.code as assignee_code, a.name as assignee_name
    FROM issues i
    LEFT JOIN agents a ON i.assignee_agent_id = a.id
    WHERE i.company_id = (SELECT id FROM companies WHERE issue_prefix = 'NET' ORDER BY created_at DESC LIMIT 1)
    AND i.status = 'backlog'
    ORDER BY
        CASE i.priority
            WHEN 'urgent' THEN 1
            WHEN 'high' THEN 2
            WHEN 'medium' THEN 3
            WHEN 'low' THEN 4
            ELSE 5
        END,
        i.created_at;
    """
    stdout, stderr, rc = run_sql(query)
    if rc != 0:
        print(f"Erro ao listar issues: {stderr}")
        return []

    issues = []
    for line in stdout.split("\n"):
        if not line.strip():
            continue
        parts = line.split("|")
        if len(parts) >= 6:
            issues.append({
                "id": parts[0].strip(),
                "title": parts[1].strip(),
                "description": parts[2].strip(),
                "priority": parts[3].strip(),
                "created_at": parts[4].strip(),
                "assignee_agent_id": parts[5].strip(),
                "assignee_code": parts[6].strip() if len(parts) > 6 else None,
                "assignee_name": parts[7].strip() if len(parts) > 7 else None,
            })
    return issues


def get_in_progress_issues():
    """Lista todas as issues em andamento."""
    query = """
    SELECT i.id, i.title, i.description, i.priority, i.created_at, i.assignee_agent_id,
           a.code as assignee_code, a.name as assignee_name
    FROM issues i
    LEFT JOIN agents a ON i.assignee_agent_id = a.id
    WHERE i.company_id = (SELECT id FROM companies WHERE issue_prefix = 'NET' ORDER BY created_at DESC LIMIT 1)
    AND i.status = 'in_progress'
    ORDER BY i.created_at;
    """
    stdout, stderr, rc = run_sql(query)
    if rc != 0:
        print(f"Erro ao listar issues em andamento: {stderr}")
        return []

    issues = []
    for line in stdout.split("\n"):
        if not line.strip():
            continue
        parts = line.split("|")
        if len(parts) >= 6:
            issues.append({
                "id": parts[0].strip(),
                "title": parts[1].strip(),
                "description": parts[2].strip(),
                "priority": parts[3].strip(),
                "created_at": parts[4].strip(),
                "assignee_agent_id": parts[5].strip(),
                "assignee_code": parts[6].strip() if len(parts) > 6 else None,
                "assignee_name": parts[7].strip() if len(parts) > 7 else None,
            })
    return issues


def checkout_issue(issue_id, agent_code):
    """
    Faz checkout atômico de uma issue para uma função.

    Usa UPDATE com RETURNING para garantir atomicidade:
    1. A issue existe e está em backlog
    2. O agente existe e está ativo
    3. A atribuição é feita atomicamente

    Retorna True se o checkout foi bem-sucedido, False caso contrário.
    """
    company_subquery = "(SELECT id FROM companies WHERE issue_prefix = 'NET' ORDER BY created_at DESC LIMIT 1)"

    # Verifica se o agente existe e está ativo
    agent = get_agent_by_code(agent_code)
    if not agent:
        print(f"❌ Agente {agent_code} não encontrado.")
        return False
    if agent["status"] != "active":
        print(f"❌ Agente {agent_code} não está ativo (status: {agent['status']}).")
        return False

    # Transação atômica: atribui a issue apenas se estiver em backlog
    query = f"""
    BEGIN;
    -- Verifica se a issue existe e está em backlog
    UPDATE issues
    SET assignee_agent_id = '{agent["id"]}',
        status = 'in_progress',
        updated_at = NOW()
    WHERE id = '{issue_id}'
    AND company_id = {company_subquery}
    AND status = 'backlog'
    RETURNING id, title, assignee_agent_id, status;

    COMMIT;
    """
    stdout, stderr, rc = run_sql(query)
    if rc != 0:
        print(f"❌ Issue {issue_id[:8]}... não pôde ser atribuída (não está em backlog ou já foi processada).")
        if stderr:
            print(f"   Detalhe: {stderr.strip()}")
        return False

    # Verifica se o RETURNING retornou alguma linha (se a issue foi atualizada)
    if not stdout.strip():
        print(f"❌ Issue {issue_id[:8]}... não pôde ser atribuída (não está em backlog ou já foi processada).")
        return False

    print(f"✅ Issue {issue_id[:8]}... atribuída a {agent['code']} ({agent['name']})")
    return True


def complete_issue(issue_id, agent_code, result_summary=""):
    """Marca uma issue como concluída, apenas se estiver atribuída ao agente."""
    agent = get_agent_by_code(agent_code)
    if not agent:
        print(f"❌ Agente {agent_code} não encontrado.")
        return False

    query = f"""
    UPDATE issues
    SET status = 'concluido',
        updated_at = NOW()
    WHERE id = '{issue_id}'
    AND company_id = (SELECT id FROM companies WHERE issue_prefix = 'NET' ORDER BY created_at DESC LIMIT 1)
    AND assignee_agent_id = '{agent["id"]}'
    AND status = 'in_progress'
    RETURNING id, title, status;
    """
    stdout, stderr, rc = run_sql(query)
    if rc != 0 or not stdout.strip():
        print(f"❌ Issue {issue_id[:8]}... não pôde ser concluída (não está atribuída a {agent_code} ou não está em andamento).")
        if stderr:
            print(f"   Detalhe: {stderr}")
        return False

    print(f"✅ Issue {issue_id[:8]}... concluída por {agent['code']} ({agent['name']})")
    if result_summary:
        print(f"   Resultado: {result_summary}")
    return True


def reassign_stuck_issues(hours_threshold=24):
    """Reatribui issues que estão in_progress há muito tempo sem atualização."""
    query = f"""
    SELECT i.id, i.title, i.assignee_agent_id, a.code as assignee_code, a.name as assignee_name,
           i.updated_at
    FROM issues i
    LEFT JOIN agents a ON i.assignee_agent_id = a.id
    WHERE i.company_id = (SELECT id FROM companies WHERE issue_prefix = 'NET' ORDER BY created_at DESC LIMIT 1)
    AND i.status = 'in_progress'
    AND i.updated_at < NOW() - INTERVAL '{hours_threshold} hours'
    ORDER BY i.updated_at;
    """
    stdout, stderr, rc = run_sql(query)
    if rc != 0:
        print(f"Erro ao buscar issues travadas: {stderr}")
        return []

    stuck_issues = []
    for line in stdout.split("\n"):
        if not line.strip():
            continue
        parts = line.split("|")
        if len(parts) >= 6:
            stuck_issues.append({
                "id": parts[0].strip(),
                "title": parts[1].strip(),
                "assignee_agent_id": parts[2].strip(),
                "assignee_code": parts[3].strip(),
                "assignee_name": parts[4].strip(),
                "updated_at": parts[5].strip(),
            })

    if not stuck_issues:
        print("✅ Nenhuma issue travada encontrada.")
        return []

    print(f"⚠️  {len(stuck_issues)} issue(s) travada(s) detectada(s):")
    for issue in stuck_issues:
        print(f"  - {issue['id'][:8]}... | {issue['title']} | atribuída a {issue['assignee_code']} | atualizada em {issue['updated_at']}")

    # Reatribui para o primeiro agente disponível com o mesmo role ou para Hermes
    for issue in stuck_issues:
        # Tenta encontrar um agente ativo com o mesmo role
        query = f"""
        SELECT code, name, role
        FROM agents
        WHERE company_id = (SELECT id FROM companies WHERE issue_prefix = 'NET' ORDER BY created_at DESC LIMIT 1)
        AND role = (SELECT role FROM agents WHERE id = '{issue["assignee_agent_id"]}')
        AND status = 'active'
        AND code != '{issue["assignee_agent_id"]}'
        LIMIT 1;
        """
        stdout, stderr, rc = run_sql(query)
        if rc == 0 and stdout.strip():
            parts = stdout.strip().split("|")
            new_agent_code = parts[0].strip()
            new_agent_name = parts[1].strip()
            print(f"  → Reatribuindo para {new_agent_code} ({new_agent_name})")
            checkout_issue(issue["id"], new_agent_code)
        else:
            # Se não há outro com o mesmo role, tenta Hermes
            print(f"  → Nenhum substituto com mesmo role. Tentando Hermes...")
            checkout_issue(issue["id"], "HERMES-001")

    return stuck_issues


def audit_audit_log():
    """Lista todas as alterações recentes de status de issues."""
    query = """
    SELECT i.id, i.title, i.status, i.assignee_agent_id, a.code as assignee_code,
           i.created_at, i.updated_at
    FROM issues i
    LEFT JOIN agents a ON i.assignee_agent_id = a.id
    WHERE i.company_id = (SELECT id FROM companies WHERE issue_prefix = 'NET' ORDER BY created_at DESC LIMIT 1)
    ORDER BY i.updated_at DESC
    LIMIT 20;
    """
    stdout, stderr, rc = run_sql(query)
    if rc != 0:
        print(f"Erro ao buscar auditoria: {stderr}")
        return

    print("--- ÚLTIMAS 20 ALTERAÇÕES DE ISSUES ---")
    for line in stdout.split("\n"):
        if not line.strip():
            continue
        parts = line.split("|")
        if len(parts) >= 7:
            print(f"  {parts[0].strip()[:8]}... | {parts[1].strip()} | {parts[2].strip()} | {parts[3].strip()} | {parts[4].strip()} | {parts[5].strip()}")


def main():
    import argparse
    parser = argparse.ArgumentParser(description="Execução de tarefas — Sistema Operacional NettosCorp")
    parser.add_argument("--list-backlog", action="store_true", help="Lista issues em backlog")
    parser.add_argument("--list-in-progress", action="store_true", help="Lista issues em andamento")
    parser.add_argument("--assign", metavar="AGENT_CODE", help="Atribui a próxima issue em backlog a um agente")
    parser.add_argument("--complete", metavar="ISSUE_ID", help="Marca uma issue como concluída")
    parser.add_argument("--agent", metavar="AGENT_CODE", help="Código do agente para atribuir/completar")
    parser.add_argument("--reassign-stuck", action="store_true", help="Reatribui issues travadas")
    parser.add_argument("--audit", action="store_true", help="Mostra auditoria de alterações recentes")
    args = parser.parse_args()

    if args.list_backlog:
        issues = list_backlog_issues()
        print("--- ISSUES EM BACKLOG ---")
        for i in issues:
            assignee = f"{i['assignee_code']} ({i['assignee_name']})" if i['assignee_code'] else "não atribuída"
            print(f"  {i['id'][:8]}... | {i['title']} | prioridade: {i['priority']} | {assignee}")
        print(f"\nTotal: {len(issues)} issue(s) em backlog.")

    if args.list_in_progress:
        issues = get_in_progress_issues()
        print("--- ISSUES EM ANDAMENTO ---")
        for i in issues:
            assignee = f"{i['assignee_code']} ({i['assignee_name']})" if i['assignee_code'] else "não atribuída"
            print(f"  {i['id'][:8]}... | {i['title']} | prioridade: {i['priority']} | {assignee}")
        print(f"\nTotal: {len(issues)} issue(s) em andamento.")

    if args.assign:
        if not args.agent:
            print("❌ É necessário especificar --agent com --assign")
            sys.exit(1)
        # Pega a primeira issue em backlog
        issues = list_backlog_issues()
        if not issues:
            print("❌ Não há issues em backlog para atribuir.")
            return
        issue = issues[0]
        print(f"Atribuindo issue {issue['id'][:8]}... ({issue['title']}) a {args.agent}...")
        checkout_issue(issue["id"], args.agent)

    if args.complete:
        if not args.agent:
            print("❌ É necessário especificar --agent com --complete")
            sys.exit(1)
        complete_issue(args.complete, args.agent)

    if args.reassign_stuck:
        reassign_stuck_issues()

    if args.audit:
        audit_audit_log()


if __name__ == "__main__":
    main()
