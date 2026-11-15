/**
 * Pré-processamento determinístico antes de chamar a IA.
 *
 * Princípio: não gastar inteligência artificial para fazer o que um script
 * resolve deterministicamente. Este módulo filtra, agrupa e reduz dados antes
 * de entregar ao modelo apenas os casos que realmente exigem interpretação.
 */

export interface AgenteRegistro {
  id: string;
  name: string;
  status: string;
  adapterType: string;
  lastHeartbeat?: string | null;
  version?: string | null;
  errors?: string[];
}

export interface CasoRelevante {
  id: string;
  name: string;
  problema: string;
  grupo: string;
  versao: string | null;
  detalhes: string[];
}

export interface PreProcessamentoResultado {
  total_agentes: number;
  agentes_com_falha: number;
  versoes_divergentes: number;
  casos_para_investigacao: number;
  casos: CasoRelevante[];
  resumo_para_hermes: string;
}

/**
 * Limite de heartbeat para considerar um agente como com falha (15 minutos).
 */
const LIMITE_HEARTBEAT_MS = 15 * 60 * 1000;

/**
 * Normaliza mensagens de erro para grupos reconhecíveis.
 */
function normalizarErro(erro: string): string {
  const e = erro.toLowerCase();
  if (e.includes("python3") || e.includes("python")) return "adaptador_windows_python";
  if (e.includes("timeout") || e.includes("connection")) return "timeout_conexao";
  if (e.includes("auth") || e.includes("token") || e.includes("api_key")) return "falha_autenticacao";
  if (e.includes("session") || e.includes("resume")) return "falha_sessao";
  if (e.includes("worktree") || e.includes("git")) return "falha_worktree";
  return "outro";
}

/**
 * Passo 1 — Filtrar agentes com falhas de inicialização.
 * Critérios: status diferente de "ready" ou heartbeat antigo (> 15 min).
 */
export function filtrarComFalhas(agentes: AgenteRegistro[]): AgenteRegistro[] {
  const limite = Date.now() - LIMITE_HEARTBEAT_MS;
  return agentes.filter((a) => {
    if (a.status !== "ready") return true;
    if (a.lastHeartbeat && new Date(a.lastHeartbeat).getTime() < limite) return true;
    return false;
  });
}

/**
 * Passo 2 — Identificar versões divergentes em relação à maioria.
 */
export function identificarVersoesDivergentes(agentes: AgenteRegistro[]): AgenteRegistro[] {
  const contagem: Record<string, number> = {};
  for (const a of agentes) {
    const v = a.version || "desconhecida";
    contagem[v] = (contagem[v] || 0) + 1;
  }
  const versaoMajoritaria =
    Object.entries(contagem).sort(([, a], [, b]) => b - a)[0]?.[0] ?? "desconhecida";
  return agentes.filter((a) => (a.version || "desconhecida") !== versaoMajoritaria);
}

/**
 * Passo 3 — Agrupar erros semelhantes por padrão normalizado.
 */
export function agruparErros(agentes: AgenteRegistro[]): Record<string, AgenteRegistro[]> {
  const grupos: Record<string, AgenteRegistro[]> = {};
  for (const a of agentes) {
    for (const erro of a.errors ?? []) {
      const grupo = normalizarErro(erro);
      if (!grupos[grupo]) grupos[grupo] = [];
      grupos[grupo].push(a);
    }
  }
  return grupos;
}

/**
 * Passo 4 — Eliminar redundância: um caso representativo por grupo de erro.
 */
export function deduplicar(
  grupos: Record<string, AgenteRegistro[]>,
): CasoRelevante[] {
  const casos: CasoRelevante[] = [];
  for (const [grupo, membros] of Object.entries(grupos)) {
    const representante = membros[0];
    casos.push({
      id: representante.id,
      name: representante.name,
      problema: grupo,
      grupo,
      versao: representante.version ?? null,
      detalhes: detalhesRepresentantes(membros),
    });
  }
  return casos;
}

function detalhesRepresentantes(membros: AgenteRegistro[]): string[] {
  const detalhes: string[] = [];
  for (const m of membros.slice(0, 3)) {
    detalhes.push(
      `${m.name} (status=${m.status}, versao=${m.version ?? "?"})`,
    );
  }
  if (membros.length > 3) {
    detalhes.push(`+ ${membros.length - 3} agente(s) com mesmo padrão`);
  }
  return detalhes;
}

/**
 * Executa o pré-processamento completo e retorna apenas os casos relevantes
 * para entregar ao modelo de IA.
 *
 * @param agentes - Lista completa de agentes da empresa
 * @returns Resultado com casos filtrados e resumo para o Hermes
 */
export function preprocessarAntesDaIA(
  agentes: AgenteRegistro[],
): PreProcessamentoResultado {
  const comFalha = filtrarComFalhas(agentes);
  const grupos = agruparErros(comFalha);
  const casos = deduplicar(grupos);
  const versoesDivergentes = identificarVersoesDivergentes(comFalha);

  return {
    total_agentes: agentes.length,
    agentes_com_falha: comFalha.length,
    versoes_divergentes: versoesDivergentes.length,
    casos_para_investigacao: casos.length,
    casos,
    resumo_para_hermes:
      casos.length === 0
        ? "Nenhum agente com falha de inicialização detectado."
        : `Encontrados ${casos.length} grupo(s) de erro em ${comFalha.length} agente(s) com falha. Entregar ao Claude apenas os casos listados acima.`,
  };
}
