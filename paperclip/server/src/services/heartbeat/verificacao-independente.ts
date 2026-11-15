/**
 * Verificação independente de execução (QA Tester).
 *
 * Quem implementa não valida o próprio trabalho. Este módulo recebe o
 * resultado de uma execução e os critérios de aceitação, realiza verificações
 * independentes e registra evidências de que o resultado funciona no ambiente
 * real antes de a tarefa ser considerada concluída.
 */

import type { AdapterExecutionResult } from "@paperclipai/adapter-utils";

export type StatusVerificacao = "aprovado" | "reprovado" | "pendente";

export interface CriterioAceitacao {
  id: string;
  descricao: string;
  verificar: (resultado: AdapterExecutionResult) => boolean;
  evidenciaEsperada: string;
}

export interface EvidenciaVerificacao {
  criterioId: string;
  aprovado: boolean;
  evidencia: string;
  verificadoPor: string; // sempre um agente diferente do implementador
  verificadoEm: string;
}

export interface ResultadoVerificacaoIndependente {
  status: StatusVerificacao;
  criterios: EvidenciaVerificacao[];
  resumo: string;
  podeEncerrar: boolean;
}

/**
 * Executa a verificação independente de um resultado de execução.
 *
 * @param resultado - Resultado da execução do adapter
 * @param criterios - Critérios de aceitação definidos antes da execução
 * @param agenteVerificador - ID do agente que está verificando (deve ser diferente do implementador)
 * @param agenteImplementador - ID do agente que implementou (para garantir independência)
 */
export function verificarIndependentemente(
  resultado: AdapterExecutionResult,
  criterios: CriterioAceitacao[],
  agenteVerificador: string,
  agenteImplementador: string,
): ResultadoVerificacaoIndependente {
  // Independência: o verificador não pode ser o mesmo que implementou
  if (agenteVerificador === agenteImplementador) {
    return {
      status: "reprovado",
      criterios: [],
      resumo:
        "Verificação reprovada: o agente verificador é o mesmo que implementou. " +
        "A verificação independente exige um agente diferente.",
      podeEncerrar: false,
    };
  }

  const evidencias: EvidenciaVerificacao[] = [];
  let todosAprovados = true;

  for (const criterio of criterios) {
    let aprovado = false;
    let evidencia = "";

    try {
      aprovado = criterio.verificar(resultado);
      evidencia = aprovado
        ? `Critério atendido: ${criterio.descricao}`
        : `Critério não atendido: ${criterio.descricao}. ${criterio.evidenciaEsperada}`;
    } catch (err) {
      aprovado = false;
      const msg = err instanceof Error ? err.message : String(err);
      evidencia = `Erro ao verificar critério "${criterio.descricao}": ${msg}`;
    }

    if (!aprovado) todosAprovados = false;

    evidencias.push({
      criterioId: criterio.id,
      aprovado,
      evidencia,
      verificadoPor: agenteVerificador,
      verificadoEm: new Date().toISOString(),
    });
  }

  const status: StatusVerificacao = todosAprovados ? "aprovado" : "reprovado";
  const resumo = todosAprovados
    ? `Verificação aprovada por ${agenteVerificador}: ${evidencias.length} critério(s) satisfeito(s).`
    : `Verificação reprovada por ${agenteVerificador}: ${evidencias.filter((e) => !e.aprovado).length} critério(s) não satisfeito(s).`;

  return {
    status,
    criterios: evidencias,
    resumo,
    podeEncerrar: todosAprovados,
  };
}

/**
 * Critérios de aceitação padrão para execuções de adapter.
 */
export const CRITERIOS_PADRAO: CriterioAceitacao[] = [
  {
    id: "execucao_sem_erro",
    descricao: "A execução terminou com código de saída 0 e sem timeout.",
    verificar: (r) =>
      typeof r.exitCode === "number" && r.exitCode === 0 && !r.timedOut,
    evidenciaEsperada: "exit_code=0, timed_out=false",
  },
  {
    id: "sem_mensagem_de_erro",
    descricao: "Não há mensagem de erro no resultado da execução.",
    verificar: (r) => !r.errorMessage,
    evidenciaEsperada: "error_message=vazio",
  },
  {
    id: "resultado_presente",
    descricao: "O resultado contém um sumário ou resposta não vazia.",
    verificar: (r) => Boolean(r.summary && r.summary.trim().length > 0),
    evidenciaEsperada: "summary não vazio",
  },
];

/**
 * Registra evidências de verificação no resultJson do resultado.
 */
export function registrarEvidenciaNoResultado(
  resultado: AdapterExecutionResult,
  verificacao: ResultadoVerificacaoIndependente,
): AdapterExecutionResult {
  return {
    ...resultado,
    resultJson: {
      ...resultado.resultJson,
      verificacao_independente: {
        status: verificacao.status,
        resumo: verificacao.resumo,
        pode_encerrar: verificacao.podeEncerrar,
        verificado_por: verificacao.criterios[0]?.verificadoPor ?? null,
        verificado_em: verificacao.criterios[0]?.verificadoEm ?? null,
        criterios: verificacao.criterios.map((c) => ({
          criterio_id: c.criterioId,
          aprovado: c.aprovado,
          evidencia: c.evidencia,
        })),
      },
    },
  };
}
