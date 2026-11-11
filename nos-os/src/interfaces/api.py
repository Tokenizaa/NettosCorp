#!/usr/bin/env python3
"""
API Própria do NOS-OS — Domínio 10: Interface e Integrações

API REST mínima usando apenas a biblioteca padrão do Python (http.server).
Não depende de frameworks externos.

Endpoints:
    GET  /api/issues              — Lista issues
    GET  /api/issues/<id>         — Detalhe de uma issue
    POST /api/issues/<id>/assign  — Atribui issue a um agente
    POST /api/issues/<id>/complete— Marca issue como concluída
    GET  /api/executions          — Lista execuções
    GET  /api/agents              — Lista agentes/funções
    GET  /api/health              — Health check

Uso:
    SUPABASE_URL=... SUPABASE_ANON_KEY=... SUPABASE_PASSWORD=... python api.py
    # Em seguida: curl http://localhost:8080/api/health
"""

import json
import os
import re
import sys
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs

# Adicionar o diretório pai ao path para importar task_executor
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "execution"))

from task_executor import (
    sql_escape, is_valid_uuid, get_agent_by_code, get_company_id,
    checkout_issue, complete_issue, complete_execution,
    list_backlog_issues, get_in_progress_issues, list_backlog_issues as _list_backlog,
    run_sql,
)

SUPABASE_PASSWORD = os.environ.get("SUPABASE_PASSWORD")
if not SUPABASE_PASSWORD:
    print("❌ SUPABASE_PASSWORD é obrigatória.")
    sys.exit(1)

COMPANY_ID = None


def get_company_id_cached():
    global COMPANY_ID
    if COMPANY_ID is None:
        COMPANY_ID = get_company_id()
    return COMPANY_ID


def query_to_list(stdout):
    """Converte saída do psql (formato -t -A) em lista de dicts."""
    if not stdout:
        return []
    results = []
    for line in stdout.strip().split("\n"):
        if not line.strip():
            continue
        parts = line.split("|")
        results.append([p.strip() for p in parts])
    return results


class NOSOSHandler(BaseHTTPRequestHandler):
    """Handler da API REST do NOS-OS."""

    def log_message(self, format, *args):
        """Suprime logs padrão do http.server."""
        pass

    def _send_json(self, status_code, data):
        body = json.dumps(data, ensure_ascii=False).encode("utf-8")
        self.send_response(status_code)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def _read_body(self):
        length = int(self.headers.get("Content-Length", 0))
        if length > 0:
            return self.rfile.read(length).decode("utf-8")
        return ""

    def do_GET(self):
        parsed = urlparse(self.path)
        path = parsed.path.rstrip("/")

        if path == "/api/health":
            self._send_json(200, {"status": "healthy", "service": "nos-os-api"})

        elif path == "/api/issues":
            issues = list_backlog_issues() + get_in_progress_issues()
            self._send_json(200, {"issues": issues, "total": len(issues)})

        elif path == "/api/agents":
            query = f"""
            SELECT code, name, purpose, status, is_ai
            FROM functions
            WHERE company_id = {sql_escape(get_company_id_cached())}
            ORDER BY code;
            """
            stdout, stderr, rc = run_sql(query)
            if rc != 0:
                self._send_json(500, {"error": stderr})
                return
            agents = []
            for line in stdout.strip().split("\n"):
                if not line.strip():
                    continue
                parts = line.split("|")
                if len(parts) >= 5:
                    agents.append({
                        "code": parts[0],
                        "name": parts[1],
                        "purpose": parts[2],
                        "status": parts[3],
                        "is_ai": parts[4] == "t",
                    })
            self._send_json(200, {"agents": agents, "total": len(agents)})

        elif path == "/api/executions":
            query = f"""
            SELECT id, execution_id, status, origin_trigger, started_at, completed_at
            FROM executions
            WHERE company_id = {sql_escape(get_company_id_cached())}
            ORDER BY started_at DESC
            LIMIT 50;
            """
            stdout, stderr, rc = run_sql(query)
            if rc != 0:
                self._send_json(500, {"error": stderr})
                return
            executions = []
            for line in stdout.strip().split("\n"):
                if not line.strip():
                    continue
                parts = line.split("|")
                if len(parts) >= 6:
                    executions.append({
                        "id": parts[0],
                        "execution_id": parts[1],
                        "status": parts[2],
                        "trigger": parts[3],
                        "started_at": parts[4],
                        "completed_at": parts[5],
                    })
            self._send_json(200, {"executions": executions, "total": len(executions)})

        elif re.match(r"^/api/issues/([0-9a-f-]+)$", path):
            match = re.match(r"^/api/issues/([0-9a-f-]+)$", path)
            issue_id = match.group(1)
            if not is_valid_uuid(issue_id):
                self._send_json(400, {"error": "UUID inválido"})
                return

            query = f"""
            SELECT i.id, i.title, i.status, i.priority, i.assignee_agent_id,
                   a.code as assignee_code, a.name as assignee_name
            FROM issues i
            LEFT JOIN agents a ON i.assignee_agent_id = a.id
            WHERE i.id = {sql_escape(issue_id)}
            AND i.company_id = {get_company_id_cached()};
            """
            stdout, stderr, rc = run_sql(query)
            if rc != 0 or not stdout.strip():
                self._send_json(404, {"error": "Issue não encontrada"})
                return

            parts = stdout.strip().split("|")
            issue = {
                "id": parts[0],
                "title": parts[1],
                "status": parts[2],
                "priority": parts[3],
                "assignee_agent_id": parts[4],
                "assignee_code": parts[5],
                "assignee_name": parts[6],
            }
            self._send_json(200, {"issue": issue})

        else:
            self._send_json(404, {"error": "Endpoint não encontrado"})

    def do_POST(self):
        parsed = urlparse(self.path)
        path = parsed.path.rstrip("/")

        # Atribuir issue
        match = re.match(r"^/api/issues/([0-9a-f-]+)/assign$", path)
        if match:
            issue_id = match.group(1)
            if not is_valid_uuid(issue_id):
                self._send_json(400, {"error": "UUID inválido"})
                return
            body = self._read_body()
            try:
                data = json.loads(body) if body else {}
            except json.JSONDecodeError:
                self._send_json(400, {"error": "JSON inválido"})
                return
            agent_code = data.get("agent_code")
            if not agent_code:
                self._send_json(400, {"error": "agent_code é obrigatório"})
                return

            result = checkout_issue(issue_id, agent_code)
            if result:
                self._send_json(200, {"issue": result, "status": "assigned"})
            else:
                self._send_json(400, {"error": "Não foi possível atribuir a issue"})
            return

        # Concluir issue
        match = re.match(r"^/api/issues/([0-9a-f-]+)/complete$", path)
        if match:
            issue_id = match.group(1)
            if not is_valid_uuid(issue_id):
                self._send_json(400, {"error": "UUID inválido"})
                return
            body = self._read_body()
            try:
                data = json.loads(body) if body else {}
            except json.JSONDecodeError:
                self._send_json(400, {"error": "JSON inválido"})
                return
            agent_code = data.get("agent_code")
            result_summary = data.get("result", "")
            if not agent_code:
                self._send_json(400, {"error": "agent_code é obrigatório"})
                return

            success = complete_issue(issue_id, agent_code, result_summary)
            if success:
                self._send_json(200, {"issue_id": issue_id, "status": "completed"})
            else:
                self._send_json(400, {"error": "Não foi possível concluir a issue"})
            return

        self._send_json(404, {"error": "Endpoint não encontrado"})


def main():
    host = "0.0.0.0"
    port = int(os.environ.get("NOS_OS_API_PORT", "8080"))

    server = HTTPServer((host, port), NOSOSHandler)
    print(f"🚀 API do NOS-OS rodando em http://{host}:{port}")
    print(f"   Endpoints: GET /api/health, /api/issues, /api/agents, /api/executions")
    print(f"              POST /api/issues/<id>/assign, /api/issues/<id>/complete")
    print("   Pressione Ctrl+C para parar.")

    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\n🛑 API parada.")
        server.server_close()


if __name__ == "__main__":
    main()
