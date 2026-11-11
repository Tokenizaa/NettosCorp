#!/usr/bin/env python3
"""
Monitor de Heartbeat — Sistema Operacional NettosCorp (NOS-OS)

Este script verifica o status de heartbeat de todas as funções organizacionais
cadastradas na tabela `agents` e identifica funções inativas (sem heartbeat
por mais de 24 horas).

Uso:
    python heartbeat_monitor.py
"""

import os
import subprocess
import tempfile
from datetime import datetime, timedelta

# Configuração do Supabase
SUPABASE_URL = os.environ.get("SUPABASE_URL", "https://udeglcdloehagljrrukj.supabase.co")
SUPABASE_ANON_KEY = os.environ.get("SUPABASE_ANON_KEY", "")

# Senha do PostgreSQL (configurada via .env ou variável de ambiente)
DB_PASSWORD = os.environ.get("SUPABASE_PASSWORD", "Hermes@964212$")


def run_sql(query):
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


def get_all_agents():
    """Lista todos os agentes da empresa NettosCorp."""
    query = """
    SELECT code, name, role, title, status, last_heartbeat_at, reports_to
    FROM agents
    WHERE company_id = (SELECT id FROM companies WHERE issue_prefix = 'NET' ORDER BY created_at DESC LIMIT 1)
    ORDER BY role, code;
    """
    stdout, stderr, rc = run_sql(query)

    if rc != 0:
        print(f"Erro ao listar agentes: {stderr}")
        return []

    agents = []
    for line in stdout.split("\n"):
        if not line.strip():
            continue
        parts = line.split("|")
        if len(parts) >= 7:
            agents.append({
                "code": parts[0].strip(),
                "name": parts[1].strip(),
                "role": parts[2].strip(),
                "title": parts[3].strip(),
                "status": parts[4].strip(),
                "last_heartbeat_at": parts[5].strip() if parts[5].strip() else None,
                "reports_to": parts[6].strip()
            })
    return agents


def check_heartbeat_staleness(agents, hours_threshold=24):
    """Identifica agentes com heartbeat desatualizado."""
    now = datetime.now()
    threshold = now - timedelta(hours=hours_threshold)

    stale_agents = []
    active_agents = []
    no_heartbeat_agents = []

    for agent in agents:
        hb = agent["last_heartbeat_at"]
        if not hb:
            no_heartbeat_agents.append(agent)
        else:
            try:
                hb_time = datetime.fromisoformat(hb.replace(" ", "T"))
                if hb_time < threshold:
                    stale_agents.append({**agent, "hours_since_heartbeat": (now - hb_time).total_seconds() / 3600})
                else:
                    active_agents.append(agent)
            except ValueError:
                no_heartbeat_agents.append(agent)

    return active_agents, stale_agents, no_heartbeat_agents


def update_heartbeat(agent_code):
    """Atualiza o heartbeat de um agente específico."""
    query = f"""
    UPDATE agents
    SET last_heartbeat_at = NOW(), status = 'active', lifecycle_state = 'ready'
    WHERE code = '{agent_code}'
    AND company_id = (SELECT id FROM companies WHERE issue_prefix = 'NET' ORDER BY created_at DESC LIMIT 1)
    RETURNING code, name, last_heartbeat_at;
    """
    stdout, stderr, rc = run_sql(query)
    return stdout, stderr, rc


def main():
    print("=" * 70)
    print("SISTEMA OPERACIONAL NETTOSCORP — Monitor de Heartbeat")
    print(f"Data/Hora: {datetime.now().strftime('%d/%m/%Y %H:%M:%S')}")
    print("=" * 70)
    print()

    agents = get_all_agents()
    print(f"Total de funções organizacionais: {len(agents)}")
    print()

    active, stale, no_hb = check_heartbeat_staleness(agents)

    print(f"--- FUNÇÕES ATIVAS (heartbeat recente) ---")
    if active:
        for a in active:
            print(f"  ✅ {a['code']} | {a['name']} | {a['role']} | Último heartbeat: {a['last_heartbeat_at']}")
    else:
        print("  Nenhuma função com heartbeat recente.")
    print()

    print(f"--- FUNÇÕES COM HEARTBEAT DESATUALIZADO (> 24h) ---")
    if stale:
        for a in stale:
            print(f"  ⚠️  {a['code']} | {a['name']} | {a['role']} | Último heartbeat: {a['last_heartbeat_at']} | {a['hours_since_heartbeat']:.1f}h atrás")
    else:
        print("  Nenhuma função com heartbeat desatualizado.")
    print()

    print(f"--- FUNÇÕES SEM HEARTBEAT REGISTRADO ---")
    if no_hb:
        for a in no_hb:
            print(f"  ❌ {a['code']} | {a['name']} | {a['role']} | Sem heartbeat registrado")
    else:
        print("  Todas as funções têm heartbeat registrado.")
    print()

    # Atualizar heartbeat de todas as funções ativas (simular check-in periódico)
    print("--- ATUALIZAÇÃO DE HEARTBEAT ---")
    for agent in agents:
        if agent["status"] == "active":
            stdout, stderr, rc = update_heartbeat(agent["code"])
            if rc == 0:
                print(f"  ✓ {agent['code']} | {agent['name']} | Heartbeat atualizado")
            else:
                print(f"  ✗ {agent['code']} | {agent['name']} | Erro: {stderr}")
    print()

    print("=" * 70)
    print("Monitor de heartbeat concluído.")
    print("=" * 70)


if __name__ == "__main__":
    main()
