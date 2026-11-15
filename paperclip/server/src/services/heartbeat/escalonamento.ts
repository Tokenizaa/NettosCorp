/**
 * Escalonamento automático de nível de esforço.
 *
 * Quando uma execução falha em um nível de esforço baixo, o Hermes escala
 * automaticamente para o nível seguinte sem exigir aprovação a cada passo.
 *
 * Níveis: baixo (5 turnos) → médio (15 turnos) → alto (50 turnos)
 */

import type { AdapterExecutionResult } from "@paperclipai/adapter-utils";

export type NivelEsforco = "baixo" | "medio" | "alto";

export const NIVEIS_ORDEM: NivelEsforco[] = ["baixo", "medio", "alto"];

export const NIVEL_PARAMETROS: Record<NivelEsforco, { maxTurns: number; timeoutSec: number }> = {
  baixo: { maxTurns: 5, timeoutSec: 300 },
  medio: { maxTurns: 15, timeoutSec: 1800 },
  alto: { maxTurns: 50, timeoutSec: 3600 },
};

/**
 * Resultado de uma execução com escalonamento.
 */
export interface ExecucaoEscalonada {
  resultado: AdapterExecutionResult;
  nivelUsado: NivelEsforco;
  escalou: boolean;
  historico: Array<{ nivel: NivelEsforco; tentativa: number; exitCode: number | null; timedOut: boolean; errorMessage?: string }>;
}

/**
 * Detecta se uma execução falhou e merece escalonamento.
 */
function executaoFalhou(resultado: AdapterExecutionResult): boolean {
  if (resultado.timedOut) return true;
  if (typeof resultado.exitCode === "number" && resultado.exitCode !== 0) return true;
  if (resultado.errorMessage) return true;
  return false;
}

/**
 * Avança para o próximo nível de esforço.
 * Retorna null se já estiver no nível máximo.
 */
function proximoNivel(atual: NivelEsforco): NivelEsforco | null {
  const idx = NIVEIS_ORDEM.indexOf(atual);
  if (idx === -1 || idx >= NIVEIS_ORDEM.length - 1) return null;
  return NIVEIS_ORDEM[idx + 1];
}

/**
 * Executa uma função de adapter com escalonamento automático de nível de esforço.
 *
 * Se a execução falhar em um nível baixo, reexecuta com o nível seguinte,
 * até chegar ao nível alto ou obter sucesso.
 *
 * @param executar - Função que recebe o nível de esforço e retorna o resultado do adapter
 * @param nivelInicial - Nível de partida (padrão: "medio")
 */
export async function executarComEscalonamento(
  executar: (nivel: NivelEsforco) => Promise<AdapterExecutionResult>,
  nivelInicial: NivelEsforco = "medio",
): Promise<ExecucaoEscalonada> {
  let nivelAtual = nivelInicial;
  const historico: ExecucaoEscalonada["historico"] = [];
  let tentativa = 0;

  while (true) {
    tentativa++;
    const resultado = await executar(nivelAtual);

    historico.push({
      nivel: nivelAtual,
      tentativa,
      exitCode: resultado.exitCode ?? null,
      timedOut: resultado.timedOut,
      errorMessage: resultado.errorMessage,
    });

    if (!executaoFalhou(resultado)) {
      return {
        resultado,
        nivelUsado: nivelAtual,
        escalou: historico.length > 1,
        historico,
      };
    }

    const proximo = proximoNivel(nivelAtual);
    if (!proximo) {
      // Já está no nível máximo, não há mais para onde escalar
      return {
        resultado,
        nivelUsado: nivelAtual,
        escalou: historico.length > 1,
        historico,
      };
    }

    nivelAtual = proximo;
  }
}
