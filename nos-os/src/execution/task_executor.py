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


def audit_executions():
    """Lista execuções recentes (Domínio 05)."""
    query = """
    SELECT e.id, e.execution_id, e.status, e.origin_trigger, e.task_or_goal_id,
           e.started_at, e.completed_at
    FROM executions e
    WHERE e.company_id = (SELECT id FROM companies WHERE issue_prefix = 'NET' ORDER BY created_at DESC LIMIT 1)
    ORDER BY e.started_at DESC
    LIMIT 20;
    """
    stdout, stderr, rc = run_sql(query)
    if rc != 0:
        print(f"Erro ao buscar execuções: {stderr}")
        return

    print("--- ÚLTIMAS 20 EXECUÇÕES ---")
    for line in stdout.split("\n"):
        if not line.strip():
            continue
        parts = line.split("|")
        if len(parts) >= 7:
            print(f"  {parts[0].strip()[:8]}... | {parts[1].strip()} | {parts[2].strip()} | {parts[3].strip()} | {parts[4].strip()} | {parts[5].strip()}")


def create_queue_items():
    """Cria itens de fila (work_queue_items) para todas as issues em backlog que ainda não têm (Domínio 04)."""
    company_subquery = "(SELECT id FROM companies WHERE issue_prefix = 'NET' ORDER BY created_at DESC LIMIT 1)"

    query = f"""
    SELECT id FROM work_queues
    WHERE company_id = {company_subquery}
    AND code = 'DEFAULT'
    LIMIT 1;
    """
    stdout, stderr, rc = run_sql(query)
    queue_id = None
    if rc == 0 and stdout.strip():
        queue_id = stdout.strip()
    else:
        query = f"""
        INSERT INTO work_queues (company_id, code, name, description, status, concurrency_limit)
        VALUES ({company_subquery}, 'DEFAULT', 'Fila Padrão', 'Fila de execução geral do NOS-OS', 'active', 1)
        RETURNING id;
        """
        stdout, stderr, rc = run_sql(query)
        if rc == 0 and stdout.strip():
            queue_id = stdout.strip()

    if not queue_id:
        print("❌ Não foi possível encontrar ou criar a fila de trabalho.")
        return []

    query = f"""
    SELECT i.id, i.title, i.priority
    FROM issues i
    WHERE i.company_id = {company_subquery}
    AND i.status = 'backlog'
    AND NOT EXISTS (
        SELECT 1 FROM work_queue_items wqi
        WHERE wqi.issue_id = i.id
        AND wqi.company_id = {company_subquery}
    )
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
        print(f"Erro ao buscar issues sem fila: {stderr}")
        return []

    created = []
    for line in stdout.split("\n"):
        if not line.strip():
            continue
        parts = line.split("|")
        if len(parts) >= 3:
            issue_id = parts[0].strip()
            priority = parts[2].strip()
            priority_num = {"urgent": 1, "high": 2, "medium": 3, "low": 4}.get(priority, 5)

            query = f"""
            INSERT INTO work_queue_items (queue_id, company_id, issue_id, status, priority, retry_count, max_retries)
            VALUES ('{queue_id}', {company_subquery}, '{issue_id}', 'pending', {priority_num}, 0, 3)
            RETURNING id;
            """
            stdout, stderr, rc = run_sql(query)
            if rc == 0 and stdout.strip():
                created.append({"id": issue_id, "title": parts[1].strip(), "queue_item_id": stdout.strip()})

    print(f"✅ {len(created)} item(ns) de fila criado(s) para issues em backlog.")
    return created


def claim_queue_item(queue_item_id, agent_code):
    """
    Faz claim atômico de um item de fila para um agente (Domínio 04).
    Usa UPDATE com RETURNING para garantir que apenas um agente pode claimar por vez.
    """
    agent = get_agent_by_code(agent_code)
    if not agent:
        print(f"❌ Agente {agent_code} não encontrado.")
        return None
    if agent["status"] != "active":
        print(f"❌ Agente {agent_code} não está ativo (status: {agent['status']}).")
        return None

    company_subquery = "(SELECT id FROM companies WHERE issue_prefix = 'NET' ORDER BY created_at DESC LIMIT 1)"
    lease_expires = (datetime.now() + timedelta(hours=1)).isoformat()

    query = f"""
    UPDATE work_queue_items
    SET status = 'claimed',
        function_agent_id = '{agent['id']}',
        claimed_by_agent_id = '{agent['id']}',
        claimed_at = NOW(),
        lease_expires_at = '{lease_expires}',
        updated_at = NOW()
    WHERE id = '{queue_item_id}'
    AND company_id = {company_subquery}
    AND status = 'pending'
    RETURNING id, issue_id, status, function_agent_id, claimed_at, lease_expires_at;
    """
    stdout, stderr, rc = run_sql(query)
    if rc != 0 or not stdout.strip():
        print(f"❌ Não foi possível claimar o item {queue_item_id[:8]}... (pode já estar claimado ou não existir).")
        if stderr:
            print(f"   Detalhe: {stderr.strip()}")
        return None

    parts = stdout.strip().split("|")
    return {
        "id": parts[0].strip(),
        "issue_id": parts[1].strip(),
        "status": parts[2].strip(),
        "function_agent_id": parts[3].strip(),
        "claimed_at": parts[4].strip(),
        "lease_expires_at": parts[5].strip(),
    }


def start_session(agent_code, trigger_source="manual", task_or_goal_id=None):
    """Inicia uma sessão de execução (Domínio 05)."""
    agent = get_agent_by_code(agent_code)
    if not agent:
        print(f"❌ Agente {agent_code} não encontrado.")
        return None

    company_subquery = "(SELECT id FROM companies WHERE issue_prefix = 'NET' ORDER BY created_at DESC LIMIT 1)"
    session_id = str(uuid4())

    query = f"""
    INSERT INTO sessions (id, company_id, execution_id, actor, trigger_source, task_or_goal_id, status, next_action, context)
    VALUES ('{session_id}', {company_subquery}, '{session_id}', 'hermes', '{trigger_source}',
            {f"'{task_or_goal_id}'" if task_or_goal_id else "NULL"}, 'active', 'iniciar_execucao', '{{"agent_code": "{agent_code}"}}'::jsonb)
    RETURNING id, actor, trigger_source, status, started_at;
    """
    stdout, stderr, rc = run_sql(query)
    if rc != 0 or not stdout.strip():
        print(f"❌ Não foi possível iniciar sessão: {stderr}")
        return None

    parts = stdout.strip().split("|")
    print(f"📋 Sessão iniciada: {parts[0].strip()[:8]}... | ator: {parts[1].strip()} | gatilho: {parts[2].strip()}")
    return {"id": parts[0].strip(), "actor": parts[1].strip(), "trigger_source": parts[2].strip()}


def start_execution(session_id, agent_code, task_or_goal_id=None, trigger_source="manual"):
    """Inicia uma execução individual (Domínio 05)."""
    agent = get_agent_by_code(agent_code)
    if not agent:
        print(f"❌ Agente {agent_code} não encontrado.")
        return None

    company_subquery = "(SELECT id FROM companies WHERE issue_prefix = 'NET' ORDER BY created_at DESC LIMIT 1)"
    execution_id = str(uuid4())

    query = f"""
    INSERT INTO executions (id, company_id, session_id, execution_id, actor, origin_trigger, task_or_goal_id, status, result_summary, artifacts, costs, next_action)
    VALUES ('{execution_id}', {company_subquery}, '{session_id}', '{execution_id}', 'hermes', '{trigger_source}',
            {f"'{task_or_goal_id}'" if task_or_goal_id else "NULL"}, 'started', NULL, '[]'::jsonb, '{{}}'::jsonb, 'iniciar_execucao')
    RETURNING id, execution_id, actor, status, started_at;
    """
    stdout, stderr, rc = run_sql(query)
    if rc != 0 or not stdout.strip():
        print(f"❌ Não foi possível iniciar execução: {stderr}")
        return None

    parts = stdout.strip().split("|")
    print(f"🚀 Execução iniciada: {parts[0].strip()[:8]}... | ID: {parts[1].strip()} | status: {parts[3].strip()}")
    return {"id": parts[0].strip(), "execution_id": parts[1].strip(), "actor": parts[2].strip(), "status": parts[3].strip()}


def add_execution_step(execution_id, step_number, name, description=""):
    """Adiciona um passo de execução (Domínio 05)."""
    query = f"""
    INSERT INTO execution_steps (execution_id, step_number, name, description, status)
    VALUES ('{execution_id}', {step_number}, '{name}', '{description}', 'pending')
    RETURNING id, step_number, name, status;
    """
    stdout, stderr, rc = run_sql(query)
    if rc != 0 or not stdout.strip():
        print(f"❌ Não foi possível adicionar passo de execução: {stderr}")
        return None

    parts = stdout.strip().split("|")
    return {"id": parts[0].strip(), "step_number": parts[1].strip(), "name": parts[2].strip()}


def update_execution_step(execution_step_id, status, result=None, error=None):
    """Atualiza o status de um passo de execução (Domínio 05)."""
    result_sql = f"'{result}'" if result is not None else "result"
    error_sql = f"'{error}'" if error is not None else "error"
    query = f"""
    UPDATE execution_steps
    SET status = '{status}',
        started_at = CASE WHEN status = 'in_progress' THEN NOW() ELSE started_at END,
        completed_at = CASE WHEN status IN ('completed', 'failed', 'skipped') THEN NOW() ELSE completed_at END,
        result = {result_sql},
        error = {error_sql}
    WHERE id = '{execution_step_id}'
    RETURNING id, status;
    """
    stdout, stderr, rc = run_sql(query)
    if rc != 0 or not stdout.strip():
        print(f"❌ Não foi possível atualizar passo de execução: {stderr}")
        return False
    return True


def add_tool_invocation(execution_id, step_id, tool_name, parameters_safe=None, authorized=False):
    """Registra uma invocação de ferramenta (Domínio 05)."""
    params_json = json.dumps(parameters_safe or {})
    query = f"""
    INSERT INTO tool_invocations (execution_id, execution_step_id, tool_name, parameters_safe, authorization_checked)
    VALUES ('{execution_id}', {f"'{step_id}'" if step_id else "NULL"}, '{tool_name}', '{params_json}'::jsonb, {str(authorized).lower()})
    RETURNING id, tool_name, authorization_checked, started_at;
    """
    stdout, stderr, rc = run_sql(query)
    if rc != 0 or not stdout.strip():
        print(f"❌ Não foi possível registrar invocação de ferramenta: {stderr}")
        return None

    parts = stdout.strip().split("|")
    return {"id": parts[0].strip(), "tool_name": parts[1].strip()}


def add_execution_artifact(execution_id, name, type_, content_url=None, content_hash=None, size_bytes=None):
    """Registra um artefato de execução (Domínio 05)."""
    query = f"""
    INSERT INTO execution_artifacts (execution_id, name, type, content_url, content_hash, size_bytes)
    VALUES ('{execution_id}', '{name}', '{type_}', {f"'{content_url}'" if content_url else "NULL"},
            {f"'{content_hash}'" if content_hash else "NULL"}, {size_bytes if size_bytes else "NULL"})
    RETURNING id, name, type;
    """
    stdout, stderr, rc = run_sql(query)
    if rc != 0 or not stdout.strip():
        print(f"❌ Não foi possível registrar artefato: {stderr}")
        return None

    parts = stdout.strip().split("|")
    return {"id": parts[0].strip(), "name": parts[1].strip()}


def create_checkpoint(execution_id, checkpoint_name, state_json=None):
    """Cria um ponto de verificação para retomada (Domínio 05)."""
    state = json.dumps(state_json or {})
    query = f"""
    INSERT INTO checkpoints (execution_id, checkpoint_name, state_json)
    VALUES ('{execution_id}', '{checkpoint_name}', '{state}'::jsonb)
    RETURNING id, checkpoint_name, created_at;
    """
    stdout, stderr, rc = run_sql(query)
    if rc != 0 or not stdout.strip():
        print(f"❌ Não foi possível criar checkpoint: {stderr}")
        return None

    parts = stdout.strip().split("|")
    print(f"💾 Checkpoint criado: {parts[1].strip()} em {parts[2].strip()}")
    return {"id": parts[0].strip(), "checkpoint_name": parts[1].strip()}


def complete_execution(execution_id, result_summary="", errors="", next_action=""):
    """Marca uma execução como concluída (Domínio 05)."""
    query = f"""
    UPDATE executions
    SET status = 'completed',
        completed_at = NOW(),
        result_summary = {f"'{result_summary}'" if result_summary else "result_summary"},
        errors = {f"'{errors}'" if errors else "errors"},
        next_action = {f"'{next_action}'" if next_action else "next_action"},
        updated_at = NOW()
    WHERE id = '{execution_id}'
    RETURNING id, status;
    """
    stdout, stderr, rc = run_sql(query)
    if rc != 0 or not stdout.strip():
        print(f"❌ Não foi possível completar execução: {stderr}")
        return False
    print(f"✅ Execução {execution_id[:8]}... concluída.")
    return True


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
    parser.add_argument("--agent-code", metavar="AGENT_CODE", help="Código do agente para atribuir/completar/executar")
    parser.add_argument("--complete", metavar="ISSUE_ID", help="Marca uma issue como concluída")
    parser.add_argument("--reassign-stuck", action="store_true", help="Reatribui issues travadas")
    parser.add_argument("--audit", action="store_true", help="Mostra auditoria de alterações recentes de issues")
    parser.add_argument("--audit-executions", action="store_true", help="Mostra auditoria de execuções recentes")
    parser.add_argument("--create-queue-items", action="store_true", help="Cria itens de fila para issues em backlog")
    parser.add_argument("--execute-next", action="store_true", help="Executa a próxima issue da fila com claim atômico")
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
        if not args.agent_code:
            print("❌ É necessário especificar --agent-code com --assign")
            sys.exit(1)
        issues = list_backlog_issues()
        if not issues:
            print("❌ Não há issues em backlog para atribuir.")
            return
        issue = issues[0]
        print(f"Atribuindo issue {issue['id'][:8]}... ({issue['title']}) a {args.agent_code}...")
        checkout_issue(issue["id"], args.agent_code)

    if args.complete:
        if not args.agent_code:
            print("❌ É necessário especificar --agent-code com --complete")
            sys.exit(1)
        complete_issue(args.complete, args.agent_code)

    if args.create_queue_items:
        create_queue_items()

    if args.execute_next:
        if not args.agent_code:
            print("❌ É necessário especificar --agent-code com --execute-next")
            sys.exit(1)
        create_queue_items()
        company_subquery = "(SELECT id FROM companies WHERE issue_prefix = 'NET' ORDER BY created_at DESC LIMIT 1)"
        query = f"""
        SELECT wqi.id, wqi.issue_id, wqi.priority
        FROM work_queue_items wqi
        WHERE wqi.company_id = {company_subquery}
        AND wqi.status = 'pending'
        ORDER BY wqi.priority, wqi.created_at
        LIMIT 1;
        """
        stdout, stderr, rc = run_sql(query)
        if rc != 0 or not stdout.strip():
            print("❌ Não há itens pendentes na fila de trabalho.")
            return

        parts = stdout.strip().split("|")
        queue_item_id = parts[0].strip()
        issue_id = parts[1].strip()

        claimed = claim_queue_item(queue_item_id, args.agent_code)
        if not claimed:
            return

        checkout_issue(issue_id, args.agent_code)

        session = start_session(args.agent_code, trigger_source="queue_claim", task_or_goal_id=issue_id)
        if session:
            execution = start_execution(session["id"], args.agent_code, task_or_goal_id=issue_id)
            if execution:
                step = add_execution_step(execution["id"], 1, "checkout_issue", f"Checkout da issue {issue_id[:8]}...")
                if step:
                    update_execution_step(step["id"], "completed", result="Issue atribuída com sucesso")
                create_checkpoint(execution["id"], "apos_checkout", {"issue_id": issue_id, "status": "in_progress"})
                complete_execution(execution["id"], result_summary=f"Issue {issue_id[:8]}... atribuída e em execução")

    if args.reassign_stuck:
        reassign_stuck_issues()

    if args.audit:
        audit_audit_log()

    if args.audit_executions:
        audit_executions()


if __name__ == "__main__":
    main()
