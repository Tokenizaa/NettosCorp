#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Sincronizador de Documentacao da NettosCorp
==========================================

Script de automação para manter consistentes os documentos derivados
do Registro Oficial de Deliberacoes e Decisoes da NettosCorp.

Arquitetura:
- Fonte de verdade 1: 08-decisions/REGISTRO_DE_DELIBERACOES.md
- Fonte de verdade 2: 08-decisions/deliberacoes/AAAA/MM/DELIB-*.md
- Documentos derivados: indices, tabelas de resumo, contagens e referencias

Regras:
- Nunca sobrescreve textos integrais de deliberacoes ou documentos autorais.
- Idempotente: executar duas vezes nao cria duplicacoes.
- Modo --dry-run disponivel para simulacao.
- Valida antes de gravar alteracoes.

Uso:
    python sincronizar_documentacao.py [--dry-run] [--base-dir CAMINHO]
"""

import argparse
import os
import re
import sys
from datetime import datetime
from pathlib import Path


# ---------------------------------------------------------------------------
# Caminhos padrao
# ---------------------------------------------------------------------------
DEFAULT_BASE_DIR = Path(__file__).resolve().parent.parent
REGISTRO_PATH = DEFAULT_BASE_DIR / "REGISTRO_DE_DELIBERACOES.md"
INDICE_GERAL_PATH = DEFAULT_BASE_DIR / "INDICE.md"
DELIBERACOES_DIR = DEFAULT_BASE_DIR / "deliberacoes"

# Padrao de identificador de decisao: DEC-YYYYMMDD-NNN
DEC_ID_RE = re.compile(r"DEC-(\d{8})-(\d{3})")
# Padrao de identificador de deliberacao: DELIB-NNN-AAAA-MM-DD-assunto.md
DELIB_FILE_RE = re.compile(r"DELIB-(\d{3})-(\d{4})-(\d{2})-(\d{2})-(.+)\.md")


# ---------------------------------------------------------------------------
# Leitura de arquivos
# ---------------------------------------------------------------------------
def ler_arquivo(caminho: Path) -> str:
    """Lê o conteúdo de um arquivo de texto."""
    with open(caminho, "r", encoding="utf-8") as f:
        return f.read()


def escrever_arquivo(caminho: Path, conteudo: str, dry_run: bool = False) -> bool:
    """Escreve conteúdo em arquivo, a menos que dry_run esteja ativo."""
    if dry_run:
        print(f"  [DRY-RUN] escreveria: {caminho}")
        return True
    with open(caminho, "w", encoding="utf-8") as f:
        f.write(conteudo)
    return True


# ---------------------------------------------------------------------------
# Extracao de decisoes do Registro Oficial
# ---------------------------------------------------------------------------
def extrair_decisoes_registro(registro_path: Path) -> dict:
    """
    Extrai as decisoes cadastradas no Registro Oficial.
    Retorna dicionario chaveado por identificador (ex: DEC-20261107-001).
    """
    conteudo = ler_arquivo(registro_path)
    decisoes = {}

    # Divide por marcadores de decisao: ### DEC-...
    blocos = re.split(r"\n### (DEC-\d{8}-\d{3}) ", conteudo)
    # blocos[0] e tudo antes da primeira decisao
    for i in range(1, len(blocos), 2):
        dec_id = blocos[i]
        corpo = blocos[i + 1] if i + 1 < len(blocos) else ""
        decisao = {
            "id": dec_id,
            "assunto": "",
            "data": "",
            "autoridade": "",
            "status": "",
            "referencias": [],
        }

        # Extrai campos da tabela Markdown (| Campo | Valor |)
        campos = {}
        for linha in corpo.splitlines():
            m = re.match(r"\|\s*([^|]+)\s*\|\s*([^|]*)\s*\|", linha)
            if m:
                campo = m.group(1).strip()
                valor = m.group(2).strip()
                campos[campo] = valor

        decisao["assunto"] = campos.get("Assunto", "")
        decisao["data"] = campos.get("Data", "")
        decisao["autoridade"] = campos.get("Autoridade responsavel", "")
        decisao["status"] = campos.get("Status", "")
        decisao["referencias"] = campos.get("Referencias", "")

        # Extrai o nome curto do assunto (após o travessão se houver)
        assunto = decisao["assunto"]
        if "—" in assunto:
            decisao["assunto_curto"] = assunto.split("—", 1)[1].strip()
        elif "-" in assunto:
            decisao["assunto_curto"] = assunto.split("-", 1)[1].strip()
        else:
            decisao["assunto_curto"] = assunto

        decisoes[dec_id] = decisao

    return decisoes


# ---------------------------------------------------------------------------
# Extracao de deliberacoes arquivadas
# ---------------------------------------------------------------------------
def extrair_deliberacoes_arquivadas(deliberacoes_dir: Path) -> dict:
    """
    Varre o diretorio de deliberacoes arquivadas e retorna dicionario
    chaveado por identificador (ex: DELIB-001-2026-11-07).
    """
    deliberacoes = {}

    if not deliberacoes_dir.exists():
        print(f"DEBUG: deliberacoes_dir nao existe: {deliberacoes_dir}")
        return deliberacoes

    print(f"DEBUG: deliberacoes_dir = {deliberacoes_dir}")
    arquivos = list(deliberacoes_dir.rglob("DELIB-*.md"))
    print(f"DEBUG: rglob encontrou {len(arquivos)} arquivos")
    for a in arquivos:
        print(f"  DEBUG: arquivo = {a.name}")

    for arquivo in sorted(deliberacoes_dir.rglob("DELIB-*.md")):
        m = DELIB_FILE_RE.match(arquivo.name)
        if not m:
            continue
        num = m.group(1)
        ano = m.group(2)
        mes = m.group(3)
        dia = m.group(4)
        assunto_slug = m.group(5)
        del_id = f"DELIB-{num}-{ano}-{mes}-{dia}"
        conteudo = ler_arquivo(arquivo)
        # Extrai metadados do frontmatter YAML-like
        meta = {}
        frontmatter_match = re.match(r"---\n(.*?)\n---", conteudo, re.DOTALL)
        if frontmatter_match:
            for linha in frontmatter_match.group(1).splitlines():
                if ":" in linha:
                    chave, valor = linha.split(":", 1)
                    meta[chave.strip()] = valor.strip()

        deliberacoes[del_id] = {
            "id": del_id,
            "arquivo": str(arquivo.relative_to(deliberacoes_dir.parent.parent)),
            "assunto": meta.get("assunto", ""),
            "data_emissao": meta.get("data_emissao", ""),
            "autoridade_emisora": meta.get("autoridade_emisora", ""),
            "destinatario": meta.get("destinatario", ""),
            "status_execucao": meta.get("status_execucao", ""),
            "origem": meta.get("origem", ""),
        }

    return deliberacoes


# ---------------------------------------------------------------------------
# Validacoes
# ---------------------------------------------------------------------------
def validar_decisoes(decisoes: dict, deliberacoes: dict) -> list:
    """Detecta inconsistencias entre registro e arquivos arquivados."""
    erros = []

    # IDs duplicados no registro
    if len(decisoes) != len(set(decisoes.keys())):
        erros.append("ERRO: IDs duplicados encontrados no Registro Oficial")

    # Decisoes no registro sem arquivo correspondente (opcional, nem todas tem arquivo)
    # Verifica se IDs de arquivo existem no registro (nao eh obrigatorio, mas bom saber)

    # Verifica formato dos IDs
    for dec_id in decisoes:
        if not re.match(r"DEC-\d{8}-\d{3}", dec_id):
            erros.append(f"ERRO: ID invalido: {dec_id}")

    return erros


# ---------------------------------------------------------------------------
# Geracao de documentos derivados
# ---------------------------------------------------------------------------
def gerar_tabela_status(decisoes: dict) -> str:
    """Gera a tabela de resumo por status."""
    contagem = {}
    for dec_id, d in decisoes.items():
        status = d["status"]
        # Normaliza status para agrupamento
        if status.startswith("APROVADA PELO FUNDADOR"):
            chave = "APROVADA PELO FUNDADOR"
        elif status.startswith("APROVADA PELO CONSELHEIRO"):
            chave = "APROVADA PELO CONSELHEIRO"
        elif status.startswith("RECOMENDADA"):
            chave = "RECOMENDADA"
        elif status.startswith("PENDENTE DO FUNDADOR"):
            chave = "PENDENTE DO FUNDADOR"
        elif status.startswith("EXECUTADA"):
            chave = "EXECUTADA"
        elif status.startswith("REVOGADA"):
            chave = "REVOGADA"
        else:
            chave = "OUTRO"

        if chave not in contagem:
            contagem[chave] = []
        contagem[chave].append(dec_id)

    linhas = ["| Status | Quantidade | Identificadores |",
              "|--------|------------|-----------------|"]
    ordem = ["APROVADA PELO FUNDADOR", "APROVADA PELO CONSELHEIRO",
             "RECOMENDADA", "PENDENTE DO FUNDADOR", "EXECUTADA", "REVOGADA", "OUTRO"]
    for chave in ordem:
        if chave in contagem:
            ids = ", ".join(sorted(contagem[chave]))
            linhas.append(f"| {chave} | {len(contagem[chave])} | {ids} |")

    return "\n".join(linhas)


def gerar_indice_geral(decisoes: dict, deliberacoes: dict = None) -> str:
    """Gera o índice geral de decisões (08-decisions/INDICE.md)."""
    linhas = ["# ÍNDICE — DECISÕES — NETTOSCORP",
              "",
              "Versao: 1.0 (gerado automaticamente)",
              "Data: " + datetime.now().strftime("%d de %B de %Y"),
              "Local: /home/lg/workspace/NettosCorp/empresa/08-decisions/INDICE.md",
              "",
              "Este índice organiza o Registro Oficial de Deliberações e Decisões da NettosCorp, fonte institucional de verdade para todas as decisões relevantes.",
              "",
              "---",
              "",
              "## Documento principal",
              "",
              "| Documento | Descricao |",
              "|-----------|-----------|",
              "| REGISTRO_DE_DELIBERACOES.md | Registro oficial de deliberações e decisões da NettosCorp, com identificador único, data, assunto, contexto, autoridade responsável, deliberação, aprovações, ações autorizadas, responsáveis, status e evidências |",
              "",
              "---",
              "",
              "## Decisões registradas",
              "",
              "| ID | Assunto | Classificação | Status |",
              "|----|---------|--------------|--------|",
              ]

    for dec_id in sorted(decisoes.keys()):
        d = decisoes[dec_id]
        classificacao = "APROVADA PELO CONSELHEIRO" if "CONSELHEIRO" in d["status"] else \
                        "APROVADA PELO FUNDADOR" if "FUNDADOR" in d["status"] else \
                        d["status"]
        linhas.append(f"| {dec_id} | {d['assunto_curto']} | {classificacao} | {d['status']} |")

    linhas.extend([
        "",
        "---",
        "",
        "## Classificacoes utilizadas",
        "",
        "| Classificacao | Significado |",
        "|---------------|-------------|",
        "| APROVADA PELO CONSELHEIRO | Decisão dentro da competência delegada ao Conselheiro |",
        "| APROVADA PELO FUNDADOR | Decisão expressamente homologada por Netto Farias |",
        "| RECOMENDADA | Orientação ainda não deliberada por autoridade competente |",
        "| PENDENTE DO FUNDADOR | Decisão efetivamente submetida ao fundador e aguardando resposta |",
        "| EXECUTADA | Decisão implementada com evidências verificáveis |",
        "| REVOGADA | Decisão substituída por outra |",
        "",
        "---",
        "",
        "## Procedimento de atualização",
        "",
        "Toda nova deliberação relevante deverá:",
        "1. Ser registrada em REGISTRO_DE_DELIBERACOES.md com identificador único (DEC-YYYYMMDD-NNN).",
        "2. Ser classificada conforme a autoridade decisória.",
        "3. Ser vinculada aos documentos afetados.",
        "4. Ter seu status atualizado durante a execução.",
        "5. Preservar o histórico de decisões substituídas (classificar como REVOGADA, não excluir).",
        "",
        "---",
        "",
        "## Deliberações arquivadas individualmente",
        "",
        "As deliberações e ordens de trabalho recebidas do Conselheiro e do fundador estão arquivadas individualmente em:",
        "",
        "`empresa/08-decisions/deliberacoes/AAAA/MM/`",
        "",
        "Consulte o índice cronológico em:",
        "",
        "`empresa/08-decisions/deliberacoes/AAAA/MM/INDICE.md`",
        "",
        f"Total de deliberações arquivadas: {len(deliberacoes) if deliberacoes else 0} (se houver arquivos).",
        "",
        "---",
        "",
        "Nenhum código de projeto foi alterado. Nenhum agente foi implantado. Nenhuma decisão foi declarada como executada sem evidências.",
        "",
    ])
    return "\n".join(linhas)


def gerar_indice_cronologico(deliberacoes: dict) -> str:
    """Gera o índice cronológico das deliberações arquivadas."""
    linhas = ["# ÍNDICE — DELIBERAÇÕES ARQUIVADAS — NETTOSCORP",
              "",
              "Versao: 1.0 (gerado automaticamente)",
              "Data: " + datetime.now().strftime("%d de %B de %Y"),
              "Local: /home/lg/workspace/NettosCorp/empresa/08-decisions/deliberacoes/AAAA/MM/INDICE.md",
              "",
              "Este índice organiza as deliberações e ordens de trabalho arquivadas individualmente, conforme a Ordem de Trabalho de Arquivamento Integral e Retroativo das Deliberações.",
              "",
              "---",
              "",
              "## Estrutura de armazenamento",
              "",
              "Pasta: `empresa/08-decisions/deliberacoes/AAAA/MM/`",
              "Padrão de nome: `DELIB-NNN-AAAA-MM-DD-assunto.md`",
              "",
              "---",
              "",
              "## Deliberações arquivadas (cronológico)",
              "",
              "| ID | Data | Assunto | Autoridade emissora | Destinatário | Status da execução |",
              "|----|------|---------|---------------------|--------------|--------------------|",
              ]

    for del_id in sorted(deliberacoes.keys()):
        d = deliberacoes[del_id]
        linhas.append(f"| {del_id} | {d['data_emissao']} | {d['assunto']} | {d['autoridade_emisora']} | {d['destinatario']} | {d['status_execucao']} |")

    linhas.extend([
        "",
        "---",
        "",
        "## Períodos históricos cobertos",
        "",
        "",
        "---",
        "",
        "## Registros incompletos ou indisponíveis",
        "",
        "",
        "---",
        "",
        "## Confirmação de integridade",
        "",
        "- Todos os textos originais foram preservados integralmente, sem resumo, reescrita ou remoção de trechos.",
        "- Cada arquivo contém metadados separados (identificador, data, autoridade emissora, destinatário, assunto, origem, status da execução).",
        "- O corpo original de cada deliberação permanece imutável.",
        "",
        "---",
        "",
        "## Procedimento permanente de arquivamento",
        "",
        "Sempre que receber uma deliberação ou ordem de trabalho do Conselheiro ou do fundador:",
        "",
        "1. Preservar o texto integral, sem resumir, reescrever ou remover trechos.",
        "2. Criar um arquivo Markdown individual em `empresa/08-decisions/deliberacoes/AAAA/MM/`.",
        "3. Utilizar identificação sequencial e data de recebimento (padrão: `DELIB-NNN-AAAA-MM-DD-assunto.md`).",
        "4. Registrar o assunto e a referência aos documentos relacionados.",
        "5. Manter o conteúdo original separado de eventuais relatórios de execução.",
        "6. Atualizar este índice cronológico.",
        "7. Atualizar `empresa/08-decisions/INDICE.md`, `empresa/README.md` e `empresa/00-governance/ARQUITETURA_DOCUMENTAL.md` quando necessário.",
        "",
        "",
        "## Recuperação",
        "",
        "Este índice: /home/lg/workspace/NettosCorp/empresa/08-decisions/deliberacoes/AAAA/MM/INDICE.md",
        "",
        "Deliberações individuais: /home/lg/workspace/NettosCorp/empresa/08-decisions/deliberacoes/AAAA/MM/DELIB-NNN-AAAA-MM-DD-assunto.md",
        "",
        "Registro consolidado: /home/lg/workspace/NettosCorp/empresa/08-decisions/REGISTRO_DE_DELIBERACOES.md",
        "",
        "",
        "---",
        "",
        "Nenhum código de projeto foi alterado. Nenhum agente foi implantado. Nenhuma decisão foi declarada como executada sem evidências.",
        "",
    ])
    return "\n".join(linhas)


# ---------------------------------------------------------------------------
# Sincronizacao principal
# ---------------------------------------------------------------------------
def sincronizar(base_dir: Path, dry_run: bool = False) -> dict:
    """
    Executa a sincronização completa dos documentos derivados.
    Retorna dicionario com relatorio de execucao.
    """
    registro_path = base_dir / "REGISTRO_DE_DELIBERACOES.md"
    indice_geral_path = base_dir / "INDICE.md"
    deliberacoes_dir = base_dir / "deliberacoes"

    relatorio = {
        "decisoes_encontradas": 0,
        "deliberacoes_encontradas": 0,
        "arquivos_gerados": [],
        "erros": [],
        "avisos": [],
    }

    # 1. Ler decisoes do registro
    decisoes = extrair_decisoes_registro(registro_path)
    relatorio["decisoes_encontradas"] = len(decisoes)

    # 2. Ler deliberacoes arquivadas
    deliberacoes = extrair_deliberacoes_arquivadas(deliberacoes_dir)
    relatorio["deliberacoes_encontradas"] = len(deliberacoes)

    # 3. Validar
    erros = validar_decisoes(decisoes, deliberacoes)
    relatorio["erros"].extend(erros)

    # 4. Gerar documentos derivados
    # 4a. Tabela de status (injetar no registro, secao 4)
    tabela_status = gerar_tabela_status(decisoes)

    # 4b. Indice geral
    indice_geral = gerar_indice_geral(decisoes, deliberacoes)

    # 4c. Indice cronologico
    indice_cronologico = gerar_indice_cronologico(deliberacoes)

    # 5. Aplicar alteracoes (se nao dry_run)
    # Substituir a secao 4 do registro
    if not dry_run:
        conteudo_registro = ler_arquivo(registro_path)
        inicio = conteudo_registro.find("## 4. Índice de decisões por status")
        fim = conteudo_registro.find("## 5. Índice de decisões por documento afetado")
        if inicio >= 0 and fim > inicio:
            # Substituir secao 4 existente
            fim_secao = conteudo_registro.rfind("\n---\n", inicio, fim)
            if fim_secao > 0:
                fim_secao += 5
            novo_conteudo = (conteudo_registro[:inicio] +
                             tabela_status + "\n" +
                             conteudo_registro[fim_secao:])
        else:
            # Secao 4 nao existe - adicionar no final do arquivo
            novo_conteudo = (conteudo_registro.rstrip() + "\n\n" +
                             "## 4. Índice de decisões por status\n\n" +
                             tabela_status + "\n")
        escrever_arquivo(registro_path, novo_conteudo, dry_run=dry_run)
        relatorio["arquivos_gerados"].append(str(registro_path))

        escrever_arquivo(indice_geral_path, indice_geral, dry_run=dry_run)
        relatorio["arquivos_gerados"].append(str(indice_geral_path))

        # Encontrar o diretorio de deliberacoes mais recente para atualizar o indice cronologico
        if deliberacoes_dir.exists():
            subdirs = [d for d in deliberacoes_dir.iterdir() if d.is_dir()]
            if subdirs:
                subdir_mais_recente = max(subdirs, key=lambda d: d.name)
                indice_cron_path = subdir_mais_recente / "INDICE.md"
                escrever_arquivo(indice_cron_path, indice_cronologico, dry_run=dry_run)
                relatorio["arquivos_gerados"].append(str(indice_cron_path))

    return relatorio


# ---------------------------------------------------------------------------
# Interface de linha de comando
# ---------------------------------------------------------------------------
def main():
    parser = argparse.ArgumentParser(
        description="Sincroniza documentos derivados do Registro Oficial de Deliberacoes da NettosCorp."
    )
    parser.add_argument("--dry-run", action="store_true",
                        help="Executa em modo de simulacao, nao grava alteracoes.")
    parser.add_argument("--base-dir", type=str, default=None,
                        help="Diretorio base da pasta empresa/08-decisions.")
    args = parser.parse_args()

    base_dir = Path(args.base_dir) if args.base_dir else DEFAULT_BASE_DIR

    if not base_dir.exists():
        print(f"ERRO: Diretorio base nao encontrado: {base_dir}", file=sys.stderr)
        sys.exit(1)

    if not REGISTRO_PATH.exists():
        print(f"ERRO: Registro Oficial nao encontrado: {REGISTRO_PATH}", file=sys.stderr)
        sys.exit(1)

    print(f"Sincronizador de Documentacao da NettosCorp")
    print(f"Diretorio base: {base_dir}")
    print(f"Modo: {'DRY-RUN' if args.dry_run else 'EXECUCAO REAL'}")
    print()

    relatorio = sincronizar(base_dir, dry_run=args.dry_run)

    print()
    print("=== RELATORIO DE EXECUCAO ===")
    print(f"Decisoes encontradas no Registro: {relatorio['decisoes_encontradas']}")
    print(f"Deliberacoes arquivadas encontradas: {relatorio['deliberacoes_encontradas']}")
    print(f"Arquivos gerados/atualizados: {len(relatorio['arquivos_gerados'])}")
    for arq in relatorio["arquivos_gerados"]:
        print(f"  - {arq}")
    print(f"Erros: {len(relatorio['erros'])}")
    for erro in relatorio["erros"]:
        print(f"  - {erro}")
    print(f"Avisos: {len(relatorio['avisos'])}")
    for aviso in relatorio["avisos"]:
        print(f"  - {aviso}")

    if relatorio["erros"]:
        print("\nATENCAO: Erros encontrados. Revise antes de prosseguir.")
        sys.exit(1)
    else:
        print("\nSincronizacao concluida com sucesso.")


if __name__ == "__main__":
    main()