#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Testes automatizados para o sincronizar_documentacao.py
"""

import os
import sys
import tempfile
import shutil
import unittest
from pathlib import Path

SCRIPT_DIR = Path(__file__).resolve().parent
sys.path.insert(0, str(SCRIPT_DIR))

from sincronizar_documentacao import (
    extrair_decisoes_registro,
    extrair_deliberacoes_arquivadas,
    validar_decisoes,
    gerar_tabela_status,
    sincronizar,
    DEC_ID_RE,
    DELIB_FILE_RE,
)


class TestExtracaoIDs(unittest.TestCase):
    """Testes de extração de IDs de decisões."""

    def test_dec_id_re_valido(self):
        self.assertIsNotNone(DEC_ID_RE.match("DEC-20261107-001"))
        self.assertIsNotNone(DEC_ID_RE.match("DEC-20260101-999"))
        self.assertIsNone(DEC_ID_RE.match("DEC-2026-01-01"))
        self.assertIsNone(DEC_ID_RE.match("X-20261107-001"))

    def test_delib_file_re_valido(self):
        self.assertIsNotNone(DELIB_FILE_RE.match("DELIB-001-2026-11-07-assunto.md"))
        self.assertIsNone(DELIB_FILE_RE.match("DEC-20261107-001.md"))
        self.assertIsNone(DELIB_FILE_RE.match("DELIB-1-2026-1-1-a.md"))


class TestExtrairDecisoesRegistro(unittest.TestCase):
    """Testes de extração de decisões do Registro Oficial."""

    def setUp(self):
        self.tmpdir = Path(tempfile.mkdtemp())
        self.registro = self.tmpdir / "REGISTRO_DE_DELIBERACOES.md"
        self.registro.write_text(
            "# REGISTRO DE DELIBERACOES\n\n---\n\n"
            "### DEC-20261107-001 — Teste 1\n\n"
            "| Campo | Valor |\n"
            "|-------|-------|\n"
            "| Identificador | DEC-20261107-001 |\n"
            "| Data | 7 de novembro de 2026 |\n"
            "| Assunto | Teste de assunto 1 |\n"
            "| Autoridade responsavel | Conselheiro |\n"
            "| Status | APROVADA PELO CONSELHEIRO |\n"
            "| Referencias | documento.md |\n"
            "\n---\n\n"
            "### DEC-20261107-002 — Teste 2\n\n"
            "| Campo | Valor |\n"
            "|-------|-------|\n"
            "| Identificador | DEC-20261107-002 |\n"
            "| Data | 8 de novembro de 2026 |\n"
            "| Assunto | Teste de assunto 2 |\n"
            "| Autoridade responsavel | Fundador |\n"
            "| Status | APROVADA PELO FUNDADOR |\n"
            "| Referencias |\n"
            "\n---\n",
            encoding="utf-8",
        )

    def tearDown(self):
        shutil.rmtree(self.tmpdir)

    def test_extrair_duas_decisoes(self):
        decisoes = extrair_decisoes_registro(self.registro)
        self.assertEqual(len(decisoes), 2)
        self.assertIn("DEC-20261107-001", decisoes)
        self.assertIn("DEC-20261107-002", decisoes)

    def test_campos_extraidos(self):
        decisoes = extrair_decisoes_registro(self.registro)
        d1 = decisoes["DEC-20261107-001"]
        self.assertEqual(d1["assunto"], "Teste de assunto 1")
        self.assertEqual(d1["data"], "7 de novembro de 2026")
        self.assertEqual(d1["autoridade"], "Conselheiro")
        self.assertEqual(d1["status"], "APROVADA PELO CONSELHEIRO")

    def test_assunto_curto(self):
        decisoes = extrair_decisoes_registro(self.registro)
        d1 = decisoes["DEC-20261107-001"]
        self.assertEqual(d1["assunto_curto"], "Teste de assunto 1")


class TestExtrairDeliberacoesArquivadas(unittest.TestCase):
    """Testes de extração de deliberações arquivadas."""

    def setUp(self):
        self.tmpdir = Path(tempfile.mkdtemp())
        self.delib_dir = self.tmpdir / "deliberacoes"
        self.subdir = self.delib_dir / "2026" / "11"
        self.subdir.mkdir(parents=True)
        self.arquivo = self.subdir / "DELIB-001-2026-11-07-teste.md"
        self.arquivo.write_text(
            "---\n"
            "identificador: DELIB-001-2026-11-07\n"
            "data_emissao: 2026-11-07\n"
            "autoridade_emisora: Fundador\n"
            "destinatario: Hermes\n"
            "assunto: Teste de deliberacao\n"
            "origem: Conversa teste\n"
            "status_execucao: Executado\n"
            "---\n\n"
            "# Teste\n\nConteudo original.\n",
            encoding="utf-8",
        )

    def tearDown(self):
        shutil.rmtree(self.tmpdir)

    def test_extrair_uma_deliberacao(self):
        # Teste com diretório vazio (não deve falhar)
        deliberacoes = extrair_deliberacoes_arquivadas(Path(tempfile.mkdtemp()) / "deliberacoes")
        self.assertEqual(len(deliberacoes), 0)


class TestValidarDecisoes(unittest.TestCase):
    """Testes de validação de consistência."""

    def test_sem_erros(self):
        decisoes = {"DEC-20261107-001": {}}
        deliberacoes = {}
        erros = validar_decisoes(decisoes, deliberacoes)
        self.assertEqual(len(erros), 0)

    def test_id_invalido(self):
        decisoes = {"DEC-2026-01-01": {}}
        deliberacoes = {}
        erros = validar_decisoes(decisoes, deliberacoes)
        self.assertTrue(any("invalido" in e.lower() for e in erros))


class TestGerarTabelaStatus(unittest.TestCase):
    """Testes de geração de tabela de status."""

    def test_contagem_por_status(self):
        decisoes = {
            "DEC-001": {"id": "DEC-001", "status": "APROVADA PELO FUNDADOR"},
            "DEC-002": {"id": "DEC-002", "status": "APROVADA PELO CONSELHEIRO"},
            "DEC-003": {"id": "DEC-003", "status": "PENDENTE DO FUNDADOR"},
            "DEC-004": {"id": "DEC-004", "status": "APROVADA PELO FUNDADOR"},
        }
        tabela = gerar_tabela_status(decisoes)
        self.assertIn("APROVADA PELO FUNDADOR | 2", tabela)
        self.assertIn("APROVADA PELO CONSELHEIRO | 1", tabela)
        self.assertIn("PENDENTE DO FUNDADOR | 1", tabela)


class TestSincronizacaoIdempotente(unittest.TestCase):
    """Teste de idempotência da execução."""

    def setUp(self):
        self.tmpdir = Path(tempfile.mkdtemp())
        self.base_dir = self.tmpdir / "08-decisions"
        self.base_dir.mkdir(parents=True)
        self.registro = self.base_dir / "REGISTRO_DE_DELIBERACOES.md"
        self.registro.write_text(
            "# REGISTRO DE DELIBERACOES\n\n---\n\n"
            "### DEC-20261107-001 — Teste\n\n"
            "| Campo | Valor |\n"
            "|-------|-------|\n"
            "| Identificador | DEC-20261107-001 |\n"
            "| Data | 7 de novembro de 2026 |\n"
            "| Assunto | Teste |\n"
            "| Autoridade responsavel | Conselheiro |\n"
            "| Status | APROVADA PELO CONSELHEIRO |\n"
            "| Referencias | doc.md |\n"
            "\n---\n\n## 4. Índice de decisões por status\n\n---\n\n## 5. Índice de decisões por documento afetado\n\n",
            encoding="utf-8",
        )
        self.indice_geral = self.base_dir / "INDICE.md"
        self.indice_geral.write_text("# INDICE ANTIGO\n", encoding="utf-8")

    def tearDown(self):
        shutil.rmtree(self.tmpdir)

    def test_execucao_idempotente(self):
        """Executar duas vezes não deve gerar erros."""
        r1 = sincronizar(self.base_dir, dry_run=False)
        self.assertEqual(r1["erros"], [])
        r2 = sincronizar(self.base_dir, dry_run=False)
        self.assertEqual(r2["erros"], [])
        self.assertEqual(r1["decisoes_encontradas"], r2["decisoes_encontradas"])


if __name__ == "__main__":
    unittest.main()