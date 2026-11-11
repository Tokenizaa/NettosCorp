# Regras de Aprendizado — Interações do Fundador

## Princípio

Cada interação entre Hermes e o fundador é registrada para ajustar automaticamente:
- **Tom** (formal, descontraído, direto)
- **Frequência** (diário, semanal, apenas bloqueios)
- **Horário** (manhã, tarde, noite)
- **Nível de detalhamento** (resumo, detalhado, técnico)
- **Canal** (Telegram DM, grupo, áudio, texto)

## Registro de interações

Formato JSONL em `cron/feedback/interacoes.jsonl`:

```json
{
  "timestamp": "2026-11-11T00:43:00-03:00",
  "tipo": "feedback-diario",
  "canal": "telegram",
  "conteudo_resumo": "Resumo de 3 agentes, 2 bloqueios",
  "reacao_fundador": "aprovou|rejeitou|ajustou|ignorou|sem_resposta",
  "ajuste_solicitado": null,
  "ajuste_aplicado": "reduzir_detalhamento"
}
```

## Ajustes automáticos

| Padrão detectado | Ajuste |
|------------------|--------|
| Fundador ignora 3 feedbacks seguidos | Reduzir frequência para semanal |
| Fundador pede "resuma mais" | Reduzir detalhamento em 50% |
| Fundador responde apenas a bloqueios | Enviar feedback apenas quando houver problemas |
| Fundador pede horário específico | Ajustar cron para o horário solicitado |
| Fundador prefere áudio | Enviar feedback como mensagem de voz |

## Memória de curto prazo

Últimas 10 interações são mantidas em memória ativa para ajustes imediatos.  
Interações anteriores ficam em `interacoes.jsonl` para aprendizado de longo prazo.
