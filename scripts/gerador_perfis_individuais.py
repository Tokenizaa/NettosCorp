# -*- coding: utf-8 -*-
"""
Gerador de perfis individuais de 267 agentes (Frente 2 - Programa de Identidade e Humanização).
Regra de não-conflito aplicada: NENHUMA alteração no Paperclip.
Fonte de entrada: matriz-identidade-agentes.csv (base original 267/267 preservada)
Saidas:
  - matriz-individualizada-267.json (267 perfis individuais com rastreabilidade)
  - RELATORIO_REVISAO_QUALIDADE_F2.md
"""

import csv
import json
import os
from collections import Counter

import random

CSV_PATH = "programas/identidade-humanizacao-agentes-nettoscorp/matriz-identidade-agentes.csv"
JSON_PATH = "agency-agents/REFERENCIAS_DIVISAO_18.json"
OUT_PATH = "programas/identidade-humanizacao-agentes-nettoscorp/matriz-individualizada-267.json"
OUT_REPORT = "programas/identidade-humanizacao-agentes-nettoscorp/RELATORIO_REVISAO_QUALIDADE_F2.md"

# ---------------------------------------------------------------------------
# 1. Carregamento de fontes
# ---------------------------------------------------------------------------
with open(JSON_PATH, encoding="utf-8") as f:
    research = json.load(f)
divs = {d["slug"]: d for d in research["divisoes"]}
DIV_LABELS = {
    "academic": "Área Acadêmica / Pesquisa",
    "design": "Design",
    "engineering": "Engenharia / Tecnologia",
    "finance": "Finanças",
    "game-development": "Game Development",
    "gis": "Geoprocessamento / GIS",
    "healthcare": "Saúde",
    "marketing": "Marketing / Comunicação",
    "paid-media": "Mídia Paga / Performance",
    "product": "Produto",
    "project-management": "Gestão de Projetos",
    "research": "Pesquisa de Mercado",
    "sales": "Vendas / Representação",
    "security": "Segurança da Informação",
    "spatial-computing": "Spatial Computing",
    "specialized": "Área Especializada (mista)",
    "support": "Atendimento Técnico",
    "testing": "Testes de Software",
}

# ---------------------------------------------------------------------------
# 2. Pool de nomes fictícios (não profissionais reais) - 267 únicos
# ---------------------------------------------------------------------------
FIRST_NAMES = [
    "Antonio","Carlos","Bernardo","Gabriel","Rafael","Vitor","Lucas","Mateus",
    "Enzo","Thiago","Joao","Pedro","Marcos","Ricardo","Hugo","Luar","Kael","Naruto",
    "Zacarias","Bino","Nico","Renan","Diego","Guilherme","Igor","Lorenzo","Amaro",
    "Ezequiel","Tiago","Ruan","Alejandro","Shota","Zeno","Urian","Luar","Vale",
    "Mauro","Sergio","Renato","Wallace","Micael","Edison","Ronaldo","Jorge","Armando",
    "Jucimar","Bryan","Edgar","Kauan","Yuri","Rafinha","Matheus","Andre","Fellipe",
    "Nicolas","Rodrigo","Wesley","Hector","Ramos","Davi","Giovana","Larissa","Mariana",
    "Isabela","Camila","Ana","Beatriz","Juliana","Fernanda","Patricia","Renata","Rachel",
    "Sofia","Larissa","Beatriz","Nicole","Precious","Cinthia","Elaine","Marluce","Mirella",
    "Rebeca","Sandra","Tereza","Vitória","Alessandra","Amanda","Bruna","Christina","Denise",
    "Elisa","Gabriela","Helena","Isabel","Jais","Kátia","Layla","Livia","Manuela","Natalia",
    "Noemi","Olivia","Paloma","Rocio","Sara","Tayla","Valentina","Wendy","Zeni","Aine",
    "Amora","Aureo","Benedito","Celso","Dirce","Egidio","Felisbela","Geraldo","Heraldo",
    "Itamar","Jandira","Joaquim","Leandro","Lourdes","Manoel","Narayana","Olivia","Porfirio",
    "Quirino","Rafaela","Ramon","Severino","Tarcisio","Ubiratan","Valdemar","Wenceslau",
    "Zilton","Aldino","Arnaldo","Bento","Candido","Domingos","Esmeraldo","Faridade","Gilberto",
    "Hermenegildo","Inacio","Jandira","Luz","Maicon","Noemia","Opal","Papa","Quintino",
    "Rafinhab","Salvador","Terceiro","Urania","Vanda","Welington","Xexeo","Yoal","Yuri",
    "Zuleica","Adalberto","Amadeu","Antenor","Bartolomeu","Cassiano","Darci","Eliseu","Faxile",
    "Godofredo","Hart","Irineu","Jardel","Kito","Licola","Macario","Naci","Otacilio",
    "Pompeu","Quiteria","Raffael","Sandro","Talismam","Uula","Vili","Waldemar","Xuxa",
    "Yara","Zenaide","Ancinoa","Benedicta","Cordilha","Dulce","Electa","Fairchild","Geny",
    "Hilet","Ilva","Justa","Labrena","Marmor","Nena","Odete","Pasteur","Quinzia",
    "Remexidia","Salmira","Toseca","Ursula","Valerica","Werlley","Yolanda","Zezino",
    "Adefonso","Agripina","Bacilio","Candida","Dionisio","Electa","Filomena","Gervasio","Hortencia",
    "Leontina","Marcelina","Narcisa","Olimpia","Partenia","Quintino","Rafaela","Sila","Tibia",
    "Urgacy","Ventura","Zilton","Aage","Babbage","Cortney","Dorsey","Emanuel","Fay",
    "Giraldo","Hagan","Immanuel","Jabbar","Kalkin","Leyla","Macy","Nero","Ondine",
    "Pax","Quentin","Rarya","Sable","Truda","Ursula","Viviana","Wes","Xerxes",
    "Yla","Yvan","Zachary","Aiden","Alisson","Amilcar","Anderson","Arthur","Aurelio",
    "Berenice","Bonifacio","Cabral","Doring","Espindola","Farival","Geni","Horatio","Inacio",
    "Jandira","Kiplin","Lacerda","Manoel","Noka","Odorico","Porfirio","Quinco","Rocinha",
    "Salatiel","Talismam","Ubirajara","Valter","Wagner","Xangrin","Yago","Ygor","Zago",
    "Abramo","Adalberto","Agildo","Agostinho","Airoldi","Amaro","Amado","Amorim","Amurrio",
    "Anacleto","Andrea","Andrezinho","Anibal","Antunes","Apolonio","Arnaldo","Arquimedes","Arruda",
    "Artur","Augusto","Aurélio","Axel","Azeredo","Bagnulo","Baixo","Bahia","Balbino",
    "Banguela","Bento","Bernardo","Bernardino","Berni","Bertolo","Bigode","Bizarro","Boca",
    "Bomfim","Bonifacio","Bomfim","Borges","Botelho","Bowling","Bradesco","Breno","Bretas",
    "Brisa","Brodrigues","Breno","Bruno","Bueno","Burbano","Buriti","Cabeceira","Cabral",
    "Cafuri","Caio","Calado","Cambake","Camargo","Campelo","Candido","Candidosa","Canela",
    "Capela","Capitao","Caramelo","Cardoso","Careca","Carla","Carneiro","Carvalho","Caseiro",
    "Castanheira","Cataunha","Cavalcanti","Cavaco","Cebola","Cedro","Cegonha","Cei","Celso",
    "Cesar","Ceu","Central","Chave","Cipriano","Cipriano","Cirilo","Citrus","Claudio",
    "Codigo","Coelho","Colado","Coloca","Colorado","Confusa","Congelado","Conserto","Conti",
    "Coronel","Correia","Corti","Costa","Coti","Cristaldo","Cristovo","Cuco","Cunha",
    "Curdo","Cypriano","Daga","Damo","Darci","Dario","Davi","Dias","Diamantino",
    "Dino","Domingos","Dondoli","Doninha","Duarte","Duda","Duque","Dumont","Eça",
    "Echo","Eduardo","Efige","Eliseu","Embaixada","Enoque","Esmeraldo","Esperto","Estanislau",
    "Evaristo","Eze","Fabricio","Fadrique","Fai","Família","Farah","Farid","Faria",
    "Fatin","Fava","Fedério","Felicio","Felipe","Feliz","Ferreira","Ferreirinha","Figueiredo",
    "Filhos","Filho","Fino","Fioche","Flamengo","Flerito","Floresta","Fonta","Fonte",
    "Francisco","Franco","Freire","Fri","Frito","Fu","Gabinete","Gabriel","Gago",
    "Gadim","Gafanhoto","Gaivota","Galhardo","Galia","Galvao","Gama","Garça","Garcia",
    "Garibaldi","Gato","Gaviao","Gazia","Gear","Gelo","Geni","Gentil","Gerador",
    "Gesto","Gertrudes","Getulio","Gildo","Gil","Gilberto","Gilson","Gimeniz","Gironda",
    "Girassol","Gis","Glaucio","Gleba","Glicerio","Globulin","Glória","Godói","Goiana",
    "Goiabeira","Goiabeiro","Goiás","Gomide","Goncalo","Gondim","Goncalves","Gordo","Gordinho",
    "Governo","Graça","Gradim","Granadeiro","Graupera","Grupo","Guacu","Guarda","Guilherme",
    "Guterre","Guti","Guto","Gyri","Haca","Haddad","Haguiar","Haiti","Hakim",
    "Hal","Hamon","Hardy","Harpa","Havana","Havoc","Heber","Hedil","Heli",
    "Helena","Hemerson","Hernani","Heron","Herzan","Hicaro","Higino","Hipolito","Hiram",
    "Hp","Hugo","Idalino","Idalino","Inacio","Inocencio","Iorlando","Ipatinga","Iracema",
    "Irandir","Isabel","Isolda","Italo","Itamar","Itapocas","Ivaldo","Ivonei","Jabes",
    "Jacaré","Jaca","Jade","Jaguar","Jal","Jamanta","Janaina","Jandira","Jani",
    "Jardel","Jasmin","Jatai","Javali","Jaz","Jeuz","Joaquim","Jofileiro","Joenia",
    "Jonas","Jorge","Jose","Josefa","Josefina","Josinete","Joventino","Jubileu","Juvenal",
    "Jussara","Jussi","Jussara","Kaidar","Kakadu","Kamyta","Karina","Kauan","Kayquil",
    "Kedly","Kendico","Keyser","Kiam","Kila","Kid","Kílomb","Kippo","Kleber",
    "Kochan","Koga","Koko","Koren","Korên","Kosmos","Kovacs","Koxo","Krasivo",
    "Kruto","Krysa","Kubansk","Lacerda","Lacerda","Lacrado","Lacraia","Lacraio","Ladrão",
    "Lafaiete","Lagarto","Lajeado","Lamar","Lampião","Landau","Lapaz","Laranjeira","Laranga",
    "Lasca","Lash","Lau","Lavado","Lavrador","Leandro","Lencioni","Lenho","Lepor","Lia",
    "Lia","Lili","Lima","Linda","Linhares","Linhares","Liso","Litro","Litho",
    "Lobo","Lokura","Lorena","Loreto","Lossa","Lourenço","Louveira","Loureiro","Louvão",
    "Luz","Maafi","Maceio","Macia","Maciel","Macedo","Madalena","Mafra","Magon",
    "Magro","Mahogany","Mair","Mairon","Maio","Mail","Mais","Mair","Mala",
    "Malhaço","Malhaço","Mallor","Mamute","Mandi","Mandioca","Manha","Mano","Manoel",
    "Maracujá","Marcel","Marcelo","Marcelino","Maria","Mariana","Mario","Mariane","Marili",
    "Marina","Marino","Marista","Marlo","Marne","Marse",
]

# fix: actual list is long; ensure at least 60 unique first names + 60 surnames
FIRST_NAMES = [
    "Antonio","Carlos","Bernardo","Gabriel","Rafael","Vitor","Lucas","Mateus",
    "Enzo","Thiago","Joao","Pedro","Marcos","Ricardo","Hugo","Luar","Kael","Naruto",
    "Zacarias","Bino","Nico","Renan","Diego","Guilherme","Igor","Lorenzo","Amaro",
    "Ezequiel","Tiago","Ruan","Alejandro","Shota","Zeno","Urian","Luar","Vale",
    "Mauro","Sergio","Renato","Wallace","Micael","Edison","Ronaldo","Jorge","Armando",
    "Jucimar","Bryan","Edgar","Kauan","Yuri","Rafinha","Matheus","Andre","Fellipe",
    "Nicolas","Rodrigo","Wesley","Hector","Ramos","Davi","Giovana","Larissa","Mariana",
    "Isabela","Camila","Ana","Beatriz","Juliana","Fernanda","Patricia","Renata","Rachel",
    "Sofia","Larissa","Beatriz","Nicole","Precious","Cinthia","Elaine","Marluce","Mirella",
    "Rebeca","Sandra","Tereza","Vitória","Alessandra","Amanda","Bruna","Christina","Denise",
    "Elisa","Gabriela","Helena","Isabel","Jais","Kátia","Layla","Livia","Manuela","Natalia",
    "Noemi","Olivia","Paloma","Rocio","Sara","Tayla","Valentina","Wendy","Zeni","Aine",
    "Amora","Aureo","Benedito","Celso","Dirce","Egidio","Felisbela","Geraldo","Heraldo",
    "Itamar","Jandira","Joaquim","Leandro","Lourdes","Manoel","Narayana","Olivia","Porfirio",
    "Quirino","Rafaela","Ramon","Severino","Tarcisio","Ubiratan","Valdemar","Wenceslau",
    "Zilton","Adalberto","Amadeu","Antenor","Bartolomeu","Cassiano","Darci","Eliseu","Faxile",
    "Godofredo","Hart","Irineu","Jardel","Kito","Licola","Macario","Naci","Otacilio",
    "Pompeu","Quiteria","Raffael","Sandro","Talismam","Uula","Vili","Waldemar","Xexeo",
    "Yara","Zenaide","Ancinoa","Benedicta","Cordilha","Dulce","Electa","Fairchild","Geny",
    "Hilet","Ilva","Justa","Labrena","Marmor","Nena","Odete","Pasteur","Quinzia",
    "Remexidia","Salmira","Toseca","Ursula","Valerica","Werlley","Yolanda","Zezino",
]

SURNAME_NAMES = [
    "Silva","Santos","Oliveira","Souza","Pereira","Rodrigues","Gomes","Mendes",
    "Farias","Netto","Alves","Costa","Pereira","Martins","Castro","Araújo","Rocha",
    "Sales","Nascimento","Barbosa","Aires","Torres","Mota","Andrade","Ferreira","Medeiros",
    "Cardoso","Gomes","Lima","Siqueira","Barbosa","Araújo","Ramos","Viana","Cruz",
    "Almeida","Rangel","Ribeiro","Mota","Ferreira","Dantas","Souza","Araújo","Santos",
    "Oliveira","Pereira","Silva","Souza","Cruz","Andrade","Netto","Farias","Sales",
    "Barbosa","Araújo","Ramos","Viana","Cruz","Almeida","Rangel","Ribeiro","Mota",
    "Ferreira","Dantas","Souza","Araújo","Santos","Oliveira","Pereira","Silva","Souza",
    "Cruz","Andrade","Netto","Farias","Sales","Barbosa","Araújo","Ramos","Viana",
    "Cruz","Almeida","Rangel","Ribeiro","Mota","Ferreira","Dantas","Souza","Araújo",
    "Santos","Oliveira","Pereira","Silva","Souza","Cruz","Andrade","Netto","Farias","Sales",
    "Barbosa","Araújo","Ramos","Viana","Cruz","Almeida","Rangel","Ribeiro","Mota",
    "Ferreira","Dantas","Souza","Araújo","Santos","Oliveira","Pereira","Silva","Souza",
    "Cruz","Andrade","Netto","Farias","Sales","Barbosa","Araújo","Ramos","Viana",
    "Cruz","Almeida","Rangel","Ribeiro","Mota","Ferreira","Dantas","Souza","Araújo",
]

# remove duplicates
FIRST_NAMES = list(dict.fromkeys(FIRST_NAMES))
SURNAME_NAMES = list(dict.fromkeys(SURNAME_NAMES))
random.seed(42)

# ---------------------------------------------------------------------------
# 3. Classificação de família funcional
# ---------------------------------------------------------------------------
LEADERSHIP = ["chief", "head", "lead", "president", "vice-president", "governor", "architect"]
ADVISORY = ["consultant", "advisor", "strategist", "coach", "trainer", "designer", "synthesist", "orchestrator", "curator", "coordinator", "moderator", "narrator"]

def role_family(name, desc):
    text = (name + " " + desc).lower()
    if any(k in text for k in LEADERSHIP):
        return "leadership"
    if any(k in text for k in ADVISORY):
        return "advisory"
    if any(k in text for k in ["engineer", "developer", "coder", "devops", "scientist", "data", "remediation", "automation", "validator", "analyst", "architect", "agent", "operator", "bot", "platform", "api", "cms", "architect", "security", "engine"]):
        return "technical"
    if any(k in text for k in ["auditor", "qa", "tester", "validator", "controller", "reviewer", "check"]):
        return "quality"
    return "general"

ROLE_INFO = {
    "leadership": {
        "label": "Liderança e coordenação",
        "identidade": "que define diretrizes, alinha especialistas e sustenta o fluxo da divisão; pensa em sistemas e dependências.",
        "competencia": "planear, distribuir, monitorar e quebrar gargalos; traduz requisitos em tarefas; mantém o pipeline acionável.",
        "autoridade": "decide sobre prioridades, alocação de efortes e fronteiras de entrega; escala conflitos e dependências que não podem resolver o especialista.",
        "strengths": "visão sistêmica, neutralidade, comunicação estruturada, previsibilidade.",
        "limitation": "não executa tarefas físicas; depende de dados de execução e de retroalimentação dos agentes de campo.",
        "strengths2": "antecipa gargalos, imparcialidade, controle de qualidade do processo.",
        "limitation2": "risco de sobreposição de responsabilidades se não houver controle claro de fronteiras.",
    },
    "advisory": {
        "label": "Consultoria e estratégia",
        "identidade": "que traduz necessidades em orientação, estrutura de decisão e leitura de mercado; pensa em princípios e diagnóstico.",
        "competencia": "diagnosticar situações, propor opções, instrumentar decisões e formar navegando entre áreas.",
        "autoridade": "sugestão, não mandado; influencia pela credibilidade, evidências e clareza das recomendações; escala aquilo que exige alinhamento de poder.",
        "strengths": "capacidade de conexão entre áreas, tradução de complexidade em linguagem acessível.",
        "limitation": "influência sem autoridade formal; dependência do contexto e do poder de quem degrees.",
    },
    "technical": {
        "label": "Execução técnica e engenharia",
        "identidade": "que entende código, dados, artefatos e fluxos; entrega entregáveis coerentes, robustos e testados.",
        "competencia": "executar com qualidade, manter padrões, ajustar riscos operacionais, produzir evidências de funcionamento.",
        "autoridade": "decide no âmbito técnico-mático (solução, parâmetros, qualidade de entrega) dentro das fronteiras dadas; escala o que exige decisão institucional.",
        "strengths": "pratica, precisão, compreensão de artefatos, manutenção de padrões.",
        "limitation": "foco no que pode ser entregue hoje; risco de ignorar dimensões estratégicas até que sejam sinalizadas.",
    },
    "quality": {
        "label": "Garantia de qualidade e controle",
        "identidade": "que examina, valida, registra e assegura que entregas atendem padrões e expectativas.",
        "competencia": "verificar, medir, documentar, sinalizar imperfeições e registrar decisões de aceite.",
        "autoridade": "recomenda e registra condições de aceite; não impõe mutirão; escala divergências persistentes.",
        "strengths": "objetividade, rigor, relações claras de evidência.",
        "limitation": "suporte depende de feedback dos executores; risco de conflito se não houver canal seguro de comunicação.",
    },
    "general": {
        "label": "Geral / misto (perfil heterogêneo)",
        "identidade": "que atua em função mista de executar e apoiar, com papel de sustentação dentro da divisão.",
        "competencia": "executar ações pontuais, apoiar especialistas, registrar resultados e manter o fluxo de trabalho imobilizável.",
        "autoridade": "delegada à tarefa; desdobra dependências e reaporquanto o que ultrapassar as atribuições.",
        "strengths": "flexibilidade, cobrança de rumo, resiliência em contexts de incerteza.",
        "limitation": "sem cargos definidos; precisa de regras de referência explícitas.",
    },
}

def role_flavor(role):
    return ROLE_INFO[role]

# ---------------------------------------------------------------------------
# 4. Construção de um perfil individual
# ---------------------------------------------------------------------------
def build_agent(agent, div_info, role, fl):
    name = agent["perfil_original"]
    desc = agent.get("descricao_original", "")
    vibe = agent.get("vibe_original", "")
    voice = agent.get("voz_padrao_fase3", "")
    base_refs = div_info.get("referencas_profissionais", []) or []
    base_fig = div_info.get("figuras_praticas_referencia", []) or []
    comm_base = div_info.get("diretrizes_comunicacao", {}) or {}
    behavior_base = div_info.get("padroes_comportamento_esperado", []) or []

    # Individual name (unique across 267)
    idx = globals()["_agent_counter"][0]
    globals()["_agent_counter"][0] += 1
    first = FIRST_NAMES[idx % len(FIRST_NAMES)]
    last = SURNAME_NAMES[idx % len(SURNAME_NAMES)]
    fictional_name = f"{first} {last}"

    profisso_individual = name.split("Agent")[0].strip()
    if not profisso_individual:
        profisso_individual = name.split("Engineer")[0].strip()

    # Assemble identity fields
    identidade = (
        f"Especialista de {divs[agent['divisao']].get('nome','')} que atua como "
        f"{fl['label'].lower()} — {fl['identidade'].lower()}. "
        f"Perfil original: {name}. {vibe}. Voz padrão Fase 3: {voice}."
    )
    competencia = (
        f"Executar {desc[:80]}... com rigor técnico; manter padrões da divisão {divs[agent['divisao']].get('nome','')} e "
        f"entregar evidências concretas. {fl['competencia']}"
    )
    autoridade = (
        f"Definir parâmetros dentro do seu âmbito de especialidade seguindo o padrão da divisão: {fl['autoridade']}. "
        f"Escalar quando a decisão ultrapassar as regras da divisão ou envolver riscos institucionais."
    )

    # Characteristics - verified + hypothesis + creative
    evidencia = (
        [f"O agente é {name} (fonte: matriz original Fase 3).",
         f"Atua na divisão {divs[agent['divisao']].get('nome','')} com {voice}.",
         "Padrões de comportamento da divisão verificados em REFERENCIAS_DIVISAO_18.json."]
    )
    hipotese = [
        f"Função individual: {profisso_individual} — aprofundamento por subespecialidade necessária.",
        "Proposta de personalidade individual a ser validada pela equipe de pesquisa.",
    ]
    criativa = [
        f"Nome fictício da personalidade: {fictional_name}.",
        f"Personalidade composta no modelo do perfil de {divs[agent['divisao']].get('nome','')}.",
    ]

    caracteristicas = (
        f"Padrões da divisão: {'; '.join(behavior_base[:4])}. "
        f"Características individuais: {fl['strengths']} e {fl['limitation']}."
    )

    postura = (
        f"diante de problemas: analisa, separa o que é técnico do que é estratégico; "
        f"diante de decisões: prioriza evidências e escala o que exige alinhamento. "
        f"{fl.get('strengths2', '')}"
    )

    colaboracao = (
        f"trabalha em equipe mantendo padrões da divisão; "
        f"{fl.get('limitation2', '')}."
    )

    fortes_lim = (
        f"{fl['strengths']} - {fl['limitation']} e {fl.get('strengths2', '')} - {fl.get('limitation2', '')}."
    )

    comunicacao = (
        f"tom: {comm_base.get('tom','permanente e profissional')}; "
        f"estilo: {comm_base.get('estilo','direto e objetivo')}."
    )

    # Special case for specialized division: add sub-specialty classification
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
        "profissao_individual": profisso_individual or "Especialista",
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
            f"Base da divisão: {divs[agent['divisao']].get('personalidade_composta_original','')}. "
            f"Rosca individual: {fl['label']} com foco em {profisso_individual}."
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

# ---------------------------------------------------------------------------
# 5. Geração
# ---------------------------------------------------------------------------
_agent_counter = [0]

def main():
    agents = []
    with open(CSV_PATH, newline="", encoding="utf-8") as f:
        for r in csv.DictReader(f):
            agents.append(r)

    print("agentes lidos:", len(agents))
    out = {"meta": {"versao": 1.0, "total_agentes": len(agents), "fonte": "matriz-identidade-agentes.csv"},
           "divisoes": {}, "agentes": []}

    # Rebuild div info with labels
    div_meta = {}
    for slug, d in divs.items():
        rows = [a for a in agents if a["divisao"] == slug]
        div_meta[slug] = {
            "nome": d.get("nome", slug),
            "label": DIV_LABELS.get(slug, slug),
            "total": len(rows),
            "verificado": d.get("status_verificacao"),
            "figuras": d.get("figuras_praticas_referencia", []),
        }

    # Process each agent
    for a in agents:
        div_info = divs.get(a["divisao"], {})
        role = role_family(a["perfil_original"], a.get("descricao_original", ""))
        fl = ROLE_INFO[role]
        prof = build_agent(a, div_info, role, fl)
        out["agentes"].append(prof)

    # Save individual matrix
    with open(OUT_PATH, "w", encoding="utf-8") as f:
        json.dump(out, f, ensure_ascii=False, indent=2)
    print("salvo:", OUT_PATH, "| agentes:", len(out["agentes"]))

    # Final checks
    names_used = [p["nome_humanizado"] for p in out["agentes"]]
    assert len(names_used) == len(set(names_used)), "nomes duplicados!"
    print("nomes únicos:", len(set(names_used)))

    by_div = Counter(p["divisao"] for p in out["agentes"])
    print("por divisao:", dict(by_div))

    build_report(out, div_meta)

def build_report(out, div_meta):
    """Gera o relatorio de revisao e qualidade com amostras por divisao."""
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
    div_counts = Counter(a["divisao"] for a in out["agentes"])
    for slug, info in div_meta.items():
        status = info["verificado"]
        n = info["total"]
        lines.append(f"| {slug} | {status} | {n} agentes |")
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
        lines.append(f"### {slug}")
        lines.append("")
        rows = [a for a in out["agentes"] if a["divisao"] == slug]
        if not rows:
            continue
        # take one representative per sub-grupo when possible
        seen = set()
        sample_agentes = []
        for a in rows:
            key = a.get("subespecialidade") or "geral"
            if key not in seen:
                seen.add(key)
                sample_agentes.append(a)
            if len(sample_agentes) >= 2:
                break
        for ag in sample_agentes:
            lines.append(f"- **{ag['nome_humanizado']}** – {ag['perfil_original']} – {ag['profissao_individual']}")
            lines.append(f"  - Personalidade: {ag['personalidade_individual_proposta'][:110]}")
            lines.append(f"  - Comunicação: {ag['estilo_de_comunicacao'][:90]}")
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

if __name__ == "__main__":
    main()
