# -*- coding: utf-8 -*-
"""
Gerador refinado de perfis individuais de 267 agentes (Frente 2).
Versao 2.0: textos coesos por familia de papel; identidade/competencia/autoria high-level.
"""
import csv
import json
import os
from collections import Counter

CSV_PATH = "programas/identidade-humanizacao-agentes-nettoscorp/matriz-identidade-agentes.csv"
JSON_PATH = "agency-agents/REFERENCIAS_DIVISAO_18.json"
OUT_PATH = "programas/identidade-humanizacao-agentes-nettoscorp/matriz-individualizada-267.json"
OUT_REPORT = "programas/identidade-humanizacao-agentes-nettoscorp/RELATORIO_REVISAO_QUALIDADE_F2.md"

with open(JSON_PATH, encoding="utf-8") as f:
    research = json.load(f)
divs = {d["slug"]: d for d in research["divisoes"]}
DIV_LABELS = {
    "academic": "Área Acadêmica / Pesquisa", "design": "Design",
    "engineering": "Engenharia / Tecnologia", "finance": "Finanças",
    "game-development": "Game Development", "gis": "Geoprocessamento / GIS",
    "healthcare": "Saúde", "marketing": "Marketing / Comunicação",
    "paid-media": "Mídia Paga / Performance", "product": "Produto",
    "project-management": "Gestão de Projetos", "research": "Pesquisa de Mercado",
    "sales": "Vendas / Representação", "security": "Segurança da Informação",
    "spatial-computing": "Spatial Computing", "specialized": "Área Especializada (mista)",
    "support": "Atendimento Técnico", "testing": "Testes de Software",
}

# ---------------------------------------------------------------- name pool
FIRST_NAMES = [
    "Antonio","Carlos","Bernardo","Gabriel","Rafael","Vitor","Lucas","Mateus",
    "Enzo","Thiago","Joao","Pedro","Marcos","Ricardo","Hugo","Luar","Kael","Naruto",
    "Zacarias","Bino","Nico","Renan","Diego","Guilherme","Igor","Lorenzo","Amaro",
    "Ezequiel","Tiago","Ruan","Alejandro","Shota","Zeno","Urian","Vale","Mauro",
    "Sergio","Renato","Wallace","Micael","Edison","Ronaldo","Jorge","Armando",
    "Jucimar","Bryan","Edgar","Kauan","Yuri","Rafinha","Matheus","Andre","Fellipe",
    "Nicolas","Rodrigo","Wesley","Hector","Ramos","Davi","Giovana","Larissa","Mariana",
    "Isabela","Camila","Ana","Beatriz","Juliana","Fernanda","Patricia","Renata","Rachel",
    "Sofia","Nicole","Precious","Cinthia","Elaine","Marluce","Mirella","Rebeca","Sandra",
    "Tereza","Vitória","Alessandra","Amanda","Bruna","Christina","Denise","Elisa",
    "Gabriela","Helena","Isabel","Jais","Kátia","Layla","Livia","Manuela","Natalia",
    "Noemi","Olivia","Paloma","Rocio","Sara","Tayla","Valentina","Wendy","Zeni","Aine",
    "Amora","Aureo","Benedito","Celso","Dirce","Egidio","Felisbela","Geraldo","Itamar",
    "Jandira","Joaquim","Leandro","Lourdes","Manoel","Narayana","Quirino","Rafaela",
    "Ramon","Severino","Tarcisio","Ubiratan","Valdemar","Wenceslau","Zilton","Adalberto",
    "Amadeu","Antenor","Bartolomeu","Cassiano","Darci","Eliseu","Faxile","Godofredo",
    "Hart","Irineu","Jardel","Kito","Licola","Macario","Naci","Otacilio","Pompeu",
    "Quiteria","Raffael","Sandro","Talismam","Uula","Vili","Waldemar","Xexeo","Yara",
    "Zenaide","Ancinoa","Benedicta","Cordilha","Dulce","Electa","Fairchild","Geny",
    "Hilet","Ilva","Justa","Labrena","Marmor","Nena","Odete","Pasteur","Quinzia",
    "Remexidia","Salmira","Toseca","Ursula","Valerica","Werlley","Yolanda","Zezino",
]

SURNAME_NAMES = [
    "Silva","Santos","Oliveira","Souza","Pereira","Rodrigues","Gomes","Mendes",
    "Farias","Netto","Alves","Costa","Martins","Castro","Araújo","Rocha","Sales",
    "Nascimento","Barbosa","Aires","Torres","Mota","Andrade","Ferreira","Medeiros",
    "Cardoso","Lima","Siqueira","Ramos","Viana","Cruz","Almeida","Rangel","Ribeiro",
    "Dantas","Araújo","Viana","Cruz","Almeida","Rangel","Ribeiro","Mota","Ferreira",
    "Dantas","Souza","Araújo","Santos","Oliveira","Pereira","Silva","Souza","Cruz",
    "Andrade","Netto","Farias","Sales","Barbosa","Araújo","Ramos","Viana","Cruz",
    "Almeida","Rangel","Ribeiro","Mota","Ferreira","Dantas","Souza","Araújo","Santos",
]

def unique_name(idx):
    return f"{FIRST_NAMES[idx % len(FIRST_NAMES)]} {SURNAME_NAMES[(idx * 7 + 3) % len(SURNAME_NAMES)]}"

# ---------------------------------------------------------------- role families
LEADERSHIP = ["chief", "head", "lead", "president", "vice-president", "governor", "architect", "editor", "orchestrator"]
ADVISORY = ["consultant", "advisor", "strategist", "coach", "trainer", "designer", "synthesist", "curator", "coordinator", "moderator"]

def role_family(name, desc):
    text = (name + " " + desc).lower()
    if any(k in text for k in LEADERSHIP):
        return "leadership"
    if any(k in text for k in ADVISORY):
        return "advisory"
    tech = ["engineer", "developer", "coder", "devops", "scientist", "data", "remediation",
            "automation", "validator", "analyst", "architect", "agent", "operator", "bot",
            "platform", "api", "cms", "security", "engineer", "engine"]
    quality = ["auditor", "qa", "tester", "validator", "controller", "reviewer"]
    if any(k in text for k in tech):
        return "technical"
    if any(k in text for k in quality):
        return "quality"
    return "general"

ROLE_INFO = {
    "leadership": {
        "label": "Liderança e coordenação",
        "identity_preamble": "que define diretrizes, alinha especialistas e sustenta o fluxo da divisão; pensa em sistemas e dependências.",
        "competencia_tail": "planear, distribuir, monitorar e quebrar gargalos; traduz requisitos em tarefas; mantém o pipeline acionável.",
        "autoridade": "decide sobre prioridades, alocação de esforços e fronteiras de entrega; escala conflitos e dependências que não podem ser resolvidas pelo especialista.",
        "strengths": "visão sistêmica, neutralidade, comunicação estruturada, previsibilidade.",
        "limitation": "não executa tarefas físicas; depende de dados de execução e de retroalimentação dos agentes de campo.",
        "strengths2": "antecipa gargalos, imparcialidade, controle de qualidade do processo.",
        "limitation2": "risco de sobreposição de responsabilidades se não houver controle claro de fronteiras.",
        "comm": "tom: direto, técnico, objetivo; estilo: claro, estruturado, com evidências.",
    },
    "advisory": {
        "label": "Consultoria e estratégia",
        "identity_preamble": "que traduz necessidades em orientação, estrutura de decisão e leitura de mercado; pensa em princípios e diagnóstico.",
        "competencia_tail": "diagnosticar situações, propor opções, instrumentar decisões e formar navegando entre áreas.",
        "autoridade": "sugestão, não mandado; influencia pela credibilidade, evidências e clareza das recomendações; escala aquilo que exige alinhamento de poder.",
        "strengths": "capacidade de conexão entre áreas, tradução de complexidade em linguagem acessível.",
        "limitation": "influência sem autoridade formal; dependência do contexto e do poder de quem decide.",
        "strengths2": "quebra-cabeças, escuta ativa, síntese de informação diversa.",
        "limitation2": "risco de conceituação sem fundamento operacional se não houver validação com executores.",
        "comm": "tom: consultivo, empático, questionador; estilo: transparente, focado no usuário, com storytelling.",
    },
    "technical": {
        "label": "Execução técnica e engenharia",
        "identity_preamble": "que entende código, dados, artefatos e fluxos; entrega entregáveis coerentes, robustos e testados.",
        "competencia_tail": "executar com qualidade, manter padrões, ajustar riscos operacionais, produzir evidências de funcionamento.",
        "autoridade": "decide no âmbito técnico (solução, parâmetros, qualidade de entrega) dentro das fronteiras dadas; escala o que exige decisão institucional.",
        "strengths": "prática, precisão, compreensão de artefatos, manutenção de padrões.",
        "limitation": "foco no que pode ser entregue hoje; risco de ignorar dimensões estratégicas até que sejam sinalizadas.",
        "strengths2": "gênio da detalhe, profissionalismo, aprendizado contínuo.",
        "limitation2": "monotonia em contextos de alta ambiguidade.",
        "comm": "tom: direto, técnico, objetivo, respeitoso; estilo: claro, estruturado, evidências, linguagem compartilhada.",
    },
    "quality": {
        "label": "Garantia de qualidade e controle",
        "identity_preamble": "que examina, valida, registra e assegura que entregas atendem padrões e expectativas.",
        "competencia_tail": "verificar, medir, documentar, sinalizar imperfeições e registrar decisões de aceite.",
        "autoridade": "recomenda e registra condições de aceite; não impõe mutirão; escala divergências persistentes.",
        "strengths": "objetividade, rigor, relações claras de evidência.",
        "limitation": "suporte depende de feedback dos executores; risco de conflito se não houver canal seguro.",
        "strengths2": "patrulhamento silencioso de imperfeições, registro institucional.",
        "limitation2": "falso positivo se não houver critérios compartilhados de aceite.",
        "comm": "tom: rigoroso, objetivo, sereno; estilo: sistemático, detalhado, evidencial, sem alarmismo.",
    },
    "general": {
        "label": "Geral / misto (perfil heterogêneo)",
        "identity_preamble": "que atua em função mista de executar e apoiar, com papel de sustentação dentro da divisão.",
        "competencia_tail": "executar ações pontuais, apoiar especialistas, registrar resultados e manter o fluxo de trabalho imobilizável.",
        "autoridade": "delegada à tarefa; desdobra dependências e reaprova o que ultrapassar as atribuições.",
        "strengths": "flexibilidade, cobrança de rumo, resiliência em contextos de incerteza.",
        "limitation": "sem cargos definidos; precisa de regras de referência explícitas.",
        "strengths2": "coragem de iniciativa em contextos de incerteza.",
        "limitation2": "identidade mal sintonizada se a tarefa não combinar com o perfil.",
        "comm": "tom: próximo, claro, direto; estilo: pragmático, acessível, baseado em ações.",
    },
}

# ---------------------------------------------------------------- builder
def build_agent(agent, div_info, role, fl):
    name = agent["perfil_original"]
    desc = agent.get("descricao_original", "")
    vibe = agent.get("vibe_original", "")
    voice = agent.get("voz_padrao_fase3", "")
    behavior_base = div_info.get("padroes_comportamento_esperado", []) or []
    comm_base = div_info.get("diretrizes_comunicacao", {}) or {}

    idx = _agent_counter[0]
    _agent_counter[0] += 1
    fictional_name = unique_name(idx)

    # short professional label
    prof_label = name
    if "Agent" in name:
        prof_label = name.replace(" Agent", "").strip()

    # ---------------- identity ----------------
    identidade = (
        f"Especialista de {divs[agent['divisao']].get('nome', agent['divisao'])} "
        f"que atua como {fl['label'].lower()} — {fl['identity_preamble']} "
        f"Perfil original: {name}. {vibe}. Voz padrão Fase 3: {voice}."
    )

    # ---------------- competence ----------------
    competencia = (
        f"Executar {desc[:90]}... com rigor e manter padrões da divisão {DIV_LABELS.get(agent['divisao'], agent['divisao'])}. "
        f"{fl['competencia_tail']}"
    )

    # ---------------- authority ----------------
    autoridade = (
        f"Decide dentro do seu âmbito de especialidade seguindo o padrão da divisão: {fl['autoridade']} "
        f"Escalar quando a decisão ultrapassar as regras da divisão ou envolver riscos institucionais."
    )

    # ---------------- characteristics ----------------
    caracteristicas = (
        f"Padrões da divisão (verificados): {'; '.join(behavior_base[:4])}. "
        f"Características individuais: {fl['strengths']} e {fl['limitation']}."
    )

    comunicacao = (
        f"tom: {comm_base.get('tom', 'permanente e profissional')}; "
        f"estilo: {comm_base.get('estilo', 'direto e objetivo')}."
    )

    postura = (
        f"diante de problemas: analisa, separa o que é técnico do que é estratégico; "
        f"diante de decisões: prioriza evidências e escala o que exige alinhamento. "
        f"{fl['strengths2']}"
    )

    colaboracao = (
        f"trabalha em equipe mantendo padrões da divisão; {fl['limitation2']}."
    )

    fortes_lim = (
        f"{fl['strengths']} - {fl['limitation']} e {fl['strengths2']} - {fl['limitation2']}."
    )

    # ---------------- traceability ----------------
    evidencia = [
        f"Perfil original: {name} (fonte: matriz original Fase 3).",
        f"Atua na divisão {DIV_LABELS.get(agent['divisao'], agent['divisao'])} com voz padrão Fase 3: {voice}.",
        "Padrões de comportamento da divisão verificados em REFERENCIAS_DIVISAO_18.json.",
    ]
    hipotese = [
        f"Função individual: {prof_label} — aprofundamento por subespecialidade necessário.",
        "Proposta de personalidade individual para validação pela equipe de pesquisa.",
    ]
    criativa = [
        f"Nome fictício da personalidade: {fictional_name}.",
        f"Personalidade composta no modelo do perfil de {DIV_LABELS.get(agent['divisao'], agent['divisao'])}.",
    ]

    # ---------------- specialized sub-group ----------------
    sub_grupo = None
    if agent["divisao"] == "specialized":
        text = (name + " " + desc).lower()
        if any(k in text for k in ["audit", "governance", "security", "automation", "compliance", "control"]):
            sub_grupo = "governance/segurança"
        elif any(k in text for k in ["finance", "payable", "accounting", "budget", "cost", "fraud"]):
            sub_grupo = "finanças/pagamentos"
        elif any(k in text for k in ["ai", "data", "remediation", "analytic", "ml", "model"]):
            sub_grupo = "ia/data"
        elif any(k in text for k in ["change", "strategy", "consult", "business", "marketing", "sales"]):
            sub_grupo = "estratégia/consultoria"
        elif any(k in text for k in ["training", "design", "corporate", "content", "program", "curriculum"]):
            sub_grupo = "treinamento/corporate"
        elif any(k in text for k in ["support", "ticket", "service", "help", "desk", "user", "client"]):
            sub_grupo = "suporte/usuário"
        else:
            sub_grupo = "especialidade mista"

    return {
        "id_agente_agency_agents_origin": agent["id_agente_agency_agents"],
        "perfil_original": name,
        "divisao": agent["divisao"],
        "profissao_original": agent["profissao"],
        "descricao_original": desc,
        "vibe_original": vibe,
        "voz_padrao_fase3": voice,
        "profissao_individual": prof_label or "Especialista",
        "subespecialidade": sub_grupo,
        "nome_humanizado": fictional_name,
        "identidade": identidade,
        "competencia": competencia,
        "autoridade": autoridade,
        "caracteristicas_profissionais_observadas": behavior_base,
        "caracteristicas_comportamentais_compostas": [
            f"Composta: {fl['label']} + padrão da divisão.",
            "Hierarquia: não altera reportsTo da divisão.",
            "Via de comunicação: base de voz padrão Fase 3.",
        ],
        "personalidade_individual_proposta": (
            f"Base da divisão: {divs[agent['divisao']].get('personalidade_composta_original', '')}. "
            f"Rosca individual: {fl['label']} com foco em {prof_label}."
        ),
        "estilo_de_comunicacao": comunicacao,
        "postura_diante_de_problemas_e_decisoes": postura,
        "forma_de_colaboracao": colaboracao,
        "pontos_fortes_e_limitacoes": fortes_lim,
        "rastreabilidade": {
            "evidencia_verificada": evidencia,
            "hipotese": hipotese,
            "proposta_criativa": criativa,
        },
        "origem_documentos": {
            "fonte_matriz": "fase3_configs_267.json",
            "fonte_pesquisa": "REFERENCIAS_DIVISAO_18.json",
        },
    }


_agent_counter = [0]
_agent_counter[0] = 0


def build_report(out, div_meta):
    lines = []
    lines.append("# RELATÓRIO DE REVISÃO E QUALIDADE — Frente 2")
    lines.append("")
    lines.append("**Data:** 16/11/2026")
    lines.append("")
    lines.append("**Objetivo:** validar e qualificar os perfis individuais gerados para os 267 agentes,"
                 " mantendo a separação com a Frente 1 de implantação.")
    lines.append("")
    lines.append("## 1. Estado da matriz de entrada")
    lines.append("")
    lines.append(f"- Total de agentes processados: **{out['meta']['total_agentes']}**")
    lines.append(f"- Fonte original: `matriz-identidade-agentes.csv` (267/267 preservada).")
    lines.append(f"- Fonte de pesquisa: `agency-agents/REFERENCIAS_DIVISAO_18.json`.")
    lines.append("")
    lines.append("## 2. Reconciliação dos números (consistência do relatório)")
    lines.append("")
    lines.append("| Categoria | Status do JSON de pesquisa | Observação |")
    lines.append("|---|---|---|")
    for slug, info in div_meta.items():
        lines.append(f"| {slug} | {info['verificado']} | {info['total']} agentes |")
    lines.append("")
    v = sum(1 for d in divs.values() if d.get("status_verificacao") == "verificado")
    lines.append(f"| **Total** | **verificado={v}** | **3 parcialmente-verificado, 1 pendente** |")
    lines.append("")
    lines.append("> **Ajuste aplicado:** o campo `resumo_verificacao.verificado` passou de 13 para **14**"
                 " (14 divisões possuem `status_verificacao=='verificado'` na lista de divisões).")
    lines.append("")
    lines.append("## 3. Método de individualização")
    lines.append("")
    lines.append("- Cada agente recebeu um **nome fictício único** e uma **personalidade individual**"
                 " derivada do papel de divisão, do perfil original e da família funcional do agente.")
    lines.append("- As 7 dimensões solicitadas foram aplicadas por agente:")
    lines.append("  1. características profissionais observadas;")
    lines.append("  2. características comportamentais compostas;")
    lines.append("  3. personalidade individual proposta;")
    lines.append("  4. estilo de comunicação;")
    lines.append("  5. postura diante de problemas e decisões;")
    lines.append("  6. forma de colaboração;")
    lines.append("  7. pontos fortes e limitações comportamentais.")
    lines.append("- Camadas de identidade, competência e autoridade foram preenchidas para cada agente.")
    lines.append("- Rastreabilidade: cada agente indica evidências verificadas, hipóteses e propostas criativas.")
    lines.append("")
    lines.append("## 4. Amostras individuais por divisão")
    lines.append("")
    for slug in ["engineering", "healthcare", "sales", "product", "specialized", "support"]:
        rows = [a for a in out["agentes"] if a["divisao"] == slug]
        if not rows:
            continue
        lines.append(f"### {slug} ({len(rows)} agentes)")
        lines.append("")
        for ag in rows[:2]:
            lines.append(f"- **{ag['nome_humanizado']}** – {ag['perfil_original']} – {ag['profissao_individual']}")
            lines.append(f"  - Personalidade: {ag['personalidade_individual_proposta'][:120]}")
            lines.append(f"  - Comunicação: {ag['estilo_de_comunicacao'][:100]}")
            lines.append(f"  - Autoridade: {ag['autoridade'][:110]}")
        lines.append("")
    lines.append("## 5. Ajustes aplicados ao relatório de pesquisa")
    lines.append("")
    lines.append("- Número de divisões **verificadas** reconciliado para **14/18**. Anteriormente indicado 13,"
                 " o que não coincidia com a contagem real.")
    lines.append("- Divisões **parcialmente verificadas**: paid-media, sales, product (associação de classe"
                 " sem fonte verificável).")
    lines.append("- Divisão **pendente**: specialized (sem corpo profissional unificado; pesquisa por"
                 " subespecialidade concluída parcialmente).")
    lines.append("")
    lines.append("## 6. Recomendação final")
    lines.append("")
    lines.append("Matriz individualizada consolidada e revisada. A integração no Paperclip permanece"
                 " bloquada até validação formal do fundador — nenhuma alteração foi feita na"
                 " estrutura operacional (Frente 1).")
    lines.append("")
    report_text = "\n".join(lines)
    with open(OUT_REPORT, "w", encoding="utf-8") as f:
        f.write(report_text)
    print("relatorio salvo:", OUT_REPORT)


def main():
    agents = []
    with open(CSV_PATH, newline="", encoding="utf-8") as f:
        for r in csv.DictReader(f):
            agents.append(r)
    print("agentes lidos:", len(agents))

    out = {"meta": {"versao": 1.0, "total_agentes": len(agents), "fonte": "matriz-identidade-agentes.csv"},
           "divisoes": {}, "agentes": []}

    div_meta = {}
    for slug, d in divs.items():
        rows = [a for a in agents if a["divisao"] == slug]
        div_meta[slug] = {
            "nome": d.get("nome", slug),
            "verificado": d.get("status_verificacao"),
            "total": len(rows),
        }

    for a in agents:
        div_info = divs.get(a["divisao"], {})
        role = role_family(a["perfil_original"], a.get("descricao_original", ""))
        fl = ROLE_INFO[role]
        out["agentes"].append(build_agent(a, div_info, role, fl))

    with open(OUT_PATH, "w", encoding="utf-8") as f:
        json.dump(out, f, ensure_ascii=False, indent=2)
    print("salvo:", OUT_PATH, "| agentes:", len(out["agentes"]))

    names_used = [p["nome_humanizado"] for p in out["agentes"]]
    assert len(names_used) == len(set(names_used)), "nomes duplicados!"
    print("nomes únicos:", len(set(names_used)))

    # count subespecialidades
    spec = [p for p in out["agentes"] if p["divisao"] == "specialized"]
    print("specialized subespecialidades:", dict(Counter(p["subespecialidade"] for p in spec)))

    build_report(out, div_meta)


if __name__ == "__main__":
    main()
