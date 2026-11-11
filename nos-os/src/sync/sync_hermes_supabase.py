#!/usr/bin/env python3
"""
Sincronização Hermes ↔ Supabase
Sistema Operacional NettosCorp

Este script sincroniza dados entre o Hermes e o banco Supabase:
- Lista agentes e seus status
- Verifica heartbeats
- Lista issues e goals
- Gera relatório de sincronização

Uso:
    python sync_hermes_supabase.py
"""

import os
import sys
import json
from datetime import datetime

# Configuração do Supabase (valores do .env do enterprise)
SUPABASE_URL = os.environ.get("SUPABASE_URL", "https://udeglcdloehagljrrukj.supabase.co")
SUPABASE_ANON_KEY = os.environ.get("SUPABASE_ANON_KEY", "")
PAPERCLIP_API_URL = os.environ.get("PAPERCLIP_API_URL", "https://api.paperclip.internal/v1")
PAPERCLIP_API_KEY = os.environ.get("PAPERCLIP_API_KEY", "")

# Nota: Este script utiliza psql via subprocess para consultar o Supabase,
# pois o cliente Python do Supabase pode não estar instalado.
# O usuário deve ter o PostgreSQL client (psql) instalado e configurado.


def run_sql(query):
    """Executa uma consulta SQL no Supabase via psql."""
    import subprocess
    import tempfile
    
    # Escreve a consulta em um arquivo temporário
    with tempfile.NamedTemporaryFile(mode='w', suffix='.sql', delete=False, encoding='utf-8') as f:
        f.write(query)
        temp_file = f.name
    
    try:
        env = os.environ.copy()
        env["PGPASSWORD"] = os.environ.get("SUPABASE_PASSWORD", "Hermes@964212$")
        
        result = subprocess.run(
            [
                "psql",
                "-h", "db.udeglcdloehagljrrukj.supabase.co",
                "-p", "5432",
                "-U", "postgres",
                "-d", "postgres",
                "-f", temp_file,
                "-t",  # Apenas dados, sem cabeçalhos
                "-A",  # Sem alinhamento
            ],
            env=env,
            capture_output=True,
            text=True,
            timeout=30
        )
        
        return result.stdout.strip(), result.stderr.strip(), result.returncode
    finally:
        os.unlink(temp_file)


def list_agents():
    """Lista todos os agentes da empresa NettosCorp."""
    query = """
    SELECT code, name, role, title, status, adapter_type, budget_monthly_cents, last_heartbeat_at
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
                "adapter_type": parts[5].strip(),
                "budget_monthly_cents": parts[6].strip(),
                "last_heartbeat_at": parts[7].strip() if len(parts) > 7 else ""
            })
    return agents


def list_issues():
    """Lista todas as issues da empresa NettosCorp."""
    query = """
    SELECT id, title, status, priority, assignee_agent_id, origin_kind
    FROM issues
    WHERE company_id = (SELECT id FROM companies WHERE issue_prefix = 'NET' ORDER BY created_at DESC LIMIT 1)
    ORDER BY created_at;
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
                "status": parts[2].strip(),
                "priority": parts[3].strip(),
                "assignee_agent_id": parts[4].strip(),
                "origin_kind": parts[5].strip()
            })
    return issues


def list_goals():
    """Lista todas as goals da empresa NettosCorp."""
    query = """
    SELECT id, title, level, status, owner_agent_id
    FROM goals
    WHERE company_id = (SELECT id FROM companies WHERE issue_prefix = 'NET' ORDER BY created_at DESC LIMIT 1)
    ORDER BY created_at;
    """
    stdout, stderr, rc = run_sql(query)
    
    if rc != 0:
        print(f"Erro ao listar goals: {stderr}")
        return []
    
    goals = []
    for line in stdout.split("\n"):
        if not line.strip():
            continue
        parts = line.split("|")
        if len(parts) >= 6:
            goals.append({
                "id": parts[0].strip(),
                "title": parts[1].strip(),
                "level": parts[2].strip(),
                "status": parts[3].strip(),
                "owner_agent_id": parts[4].strip()
            })
    return goals


def main():
    print("=" * 60)
    print("SISTEMA OPERACIONAL NETTOSCORP — Sincronização Hermes ↔ Supabase")
    print("=" * 60)
    print()
    
    # Listar agentes
    print("--- AGENTES (Funções Organizacionais + Hermes IA) ---")
    agents = list_agents()
    print(f"Total de agentes: {len(agents)}")
    for a in agents:
        print(f"  {a['code']} | {a['name']} | {a['role']} | {a['title']} | {a['status']} | heartbeat: {a['last_heartbeat_at']}")
    print()
    
    # Listar issues
    print("--- ISSUES (Tarefas Operacionais) ---")
    issues = list_issues()
    print(f"Total de issues: {len(issues)}")
    for i in issues:
        print(f"  {i['id'][:8]}... | {i['title']} | {i['status']} | prioridade: {i['priority']} | assignee: {i['assignee_agent_id']}")
    print()
    
    # Listar goals
    print("--- GOALS (Objetivos Organizacionais) ---")
    goals = list_goals()
    print(f"Total de goals: {len(goals)}")
    for g in goals:
        print(f"  {g['id'][:8]}... | {g['title']} | {g['level']} | {g['status']} | owner: {g['owner_agent_id']}")
    print()
    
    print("=" * 60)
    print("Sincronização concluída.")
    print("=" * 60)


if __name__ == "__main__":
    main()
