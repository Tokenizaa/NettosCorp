#!/usr/bin/env python3
"""
Geração de Relatórios — Sistema Operacional NettosCorp

Este script gera relatórios periódicos para o fundador:
- Relatório diário: status de funções, tarefas concluídas, em andamento, backlog
- Relatório semanal: métricas da semana, plano para próxima semana

Uso:
    python generate_report.py --type daily
    python generate_report.py --type weekly
"""

import os
import sys
import json
import argparse
from datetime import datetime, timedelta

# Configuração do Supabase (valores obrigatórios via variáveis de ambiente)
SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_ANON_KEY = os.environ.get("SUPABASE_ANON_KEY")

if not SUPABASE_URL or not SUPABASE_ANON_KEY:
    raise RuntimeError("SUPABASE_URL e SUPABASE_ANON_KEY são obrigatórios no ambiente.")

# Senha do PostgreSQL (obrigatória via variável de ambiente SUPABASE_PASSWORD)
DB_PASSWORD = os.environ.get("SUPABASE_PASSWORD")
if not DB_PASSWORD:
    raise RuntimeError("SUPABASE_PASSWORD não definida no ambiente. Não use credenciais hardcoded.")


def run_sql(query):
    """Executa uma consulta SQL no Supabase via psql."""
    import subprocess
    import tempfile
    
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


def get_agents_summary():
    """Obtém resumo dos agentes."""
    query = """
    SELECT role, status, COUNT(*) as total
    FROM agents
    WHERE company_id = (SELECT id FROM companies WHERE issue_prefix = 'NET' ORDER BY created_at DESC LIMIT 1)
    GROUP BY role, status
    ORDER BY role, status;
    """
    stdout, stderr, rc = run_sql(query)
    
    if rc != 0:
        return f"Erro: {stderr}"
    
    result = []
    for line in stdout.split("\n"):
        if not line.strip():
            continue
        parts = line.split("|")
        if len(parts) >= 3:
            result.append(f"  {parts[0].strip()} | {parts[1].strip()} | {parts[2].strip()} função(ões)")
    return "\n".join(result) if result else "Nenhum agente encontrado."


def get_issues_summary():
    """Obtém resumo das issues."""
    query = """
    SELECT status, COUNT(*) as total
    FROM issues
    WHERE company_id = (SELECT id FROM companies WHERE issue_prefix = 'NET' ORDER BY created_at DESC LIMIT 1)
    GROUP BY status
    ORDER BY status;
    """
    stdout, stderr, rc = run_sql(query)
    
    if rc != 0:
        return f"Erro: {stderr}"
    
    result = []
    for line in stdout.split("\n"):
        if not line.strip():
            continue
        parts = line.split("|")
        if len(parts) >= 2:
            result.append(f"  {parts[0].strip()} | {parts[1].strip()} tarefa(s)")
    return "\n".join(result) if result else "Nenhuma issue encontrada."


def get_completed_issues_today():
    """Obtém issues concluídas hoje."""
    query = """
    SELECT title, assignee_agent_id, updated_at
    FROM issues
    WHERE company_id = (SELECT id FROM companies WHERE issue_prefix = 'NET' ORDER BY created_at DESC LIMIT 1)
    AND status = 'concluido'
    AND updated_at >= CURRENT_DATE
    ORDER BY updated_at DESC;
    """
    stdout, stderr, rc = run_sql(query)
    
    if rc != 0:
        return f"Erro: {stderr}"
    
    result = []
    for line in stdout.split("\n"):
        if not line.strip():
            continue
        parts = line.split("|")
        if len(parts) >= 3:
            result.append(f"  - {parts[1].strip()} | {parts[2].strip()} | {parts[0].strip()[:8]}...")
    return "\n".join(result) if result else "Nenhuma tarefa concluída hoje."


def get_in_progress_issues():
    """Obtém issues em andamento."""
    query = """
    SELECT title, assignee_agent_id
    FROM issues
    WHERE company_id = (SELECT id FROM companies WHERE issue_prefix = 'NET' ORDER BY created_at DESC LIMIT 1)
    AND status = 'in_progress'
    ORDER BY created_at;
    """
    stdout, stderr, rc = run_sql(query)
    
    if rc != 0:
        return f"Erro: {stderr}"
    
    result = []
    for line in stdout.split("\n"):
        if not line.strip():
            continue
        parts = line.split("|")
        if len(parts) >= 2:
            result.append(f"  - {parts[1].strip()} | {parts[2].strip()[:8]}...")
    return "\n".join(result) if result else "Nenhuma tarefa em andamento."


def get_backlog_issues():
    """Obtém issues em backlog."""
    query = """
    SELECT title, assignee_agent_id
    FROM issues
    WHERE company_id = (SELECT id FROM companies WHERE issue_prefix = 'NET' ORDER BY created_at DESC LIMIT 1)
    AND status = 'backlog'
    ORDER BY created_at;
    """
    stdout, stderr, rc = run_sql(query)
    
    if rc != 0:
        return f"Erro: {stderr}"
    
    result = []
    for line in stdout.split("\n"):
        if not line.strip():
            continue
        parts = line.split("|")
        if len(parts) >= 2:
            result.append(f"  - {parts[1].strip()} | {parts[2].strip()[:8]}...")
    return "\n".join(result) if result else "Nenhuma tarefa em backlog."


def generate_daily_report():
    """Gera relatório diário."""
    print("=" * 60)
    print("RELATÓRIO DIÁRIO — SISTEMA OPERACIONAL NETTOSCORP")
    print(f"Data: {datetime.now().strftime('%d/%m/%Y %H:%M')}")
    print("=" * 60)
    print()
    
    print("--- FUNÇÕES ORGANIZACIONAIS (Agentes no Banco) ---")
    print(get_agents_summary())
    print()
    
    print("--- TAREFAS CONCLUÍDAS HOJE ---")
    print(get_completed_issues_today())
    print()
    
    print("--- TAREFAS EM ANDAMENTO ---")
    print(get_in_progress_issues())
    print()
    
    print("--- TAREFAS EM BACKLOG ---")
    print(get_backlog_issues())
    print()
    
    print("=" * 60)
    print("Fim do relatório diário.")
    print("=" * 60)


def generate_weekly_report():
    """Gera relatório semanal."""
    print("=" * 60)
    print("RELATÓRIO SEMANAL — SISTEMA OPERACIONAL NETTOSCORP")
    print(f"Data: {datetime.now().strftime('%d/%m/%Y %H:%M')}")
    print("=" * 60)
    print()
    
    print("--- RESUMO DE FUNÇÕES ---")
    print(get_agents_summary())
    print()
    
    print("--- RESUMO DE TAREFAS POR STATUS ---")
    print(get_issues_summary())
    print()
    
    print("--- TAREFAS EM ANDAMENTO ---")
    print(get_in_progress_issues())
    print()
    
    print("--- TAREFAS EM BACKLOG ---")
    print(get_backlog_issues())
    print()
    
    print("--- PLANO PARA PRÓXIMA SEMANA ---")
    print("  1. Continuar execução das tarefas em backlog")
    print("  2. Monitorar heartbeats das funções organizacionais")
    print("  3. Integrar com API Paperclip (quando credenciais forem liberadas)")
    print("  4. Popular dados de projetos, departamentos e posições")
    print()
    
    print("=" * 60)
    print("Fim do relatório semanal.")
    print("=" * 60)


def main():
    parser = argparse.ArgumentParser(description="Gerador de relatórios do Sistema Operacional NettosCorp")
    parser.add_argument("--type", choices=["daily", "weekly"], default="daily", help="Tipo de relatório")
    args = parser.parse_args()
    
    if args.type == "daily":
        generate_daily_report()
    elif args.type == "weekly":
        generate_weekly_report()


if __name__ == "__main__":
    main()
