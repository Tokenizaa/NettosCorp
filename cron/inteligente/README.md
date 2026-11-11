# CRON INTELIGENTE — FEEDBACK AUTOMÁTICO COM APRENDIZADO

**Versão:** 1.0  
**Data:** 11 de novembro de 2026  
**Autor:** Hermes (Chefe de Gabinete Executivo)

## 1. Objetivo

Fornecer feedback periódico e automático sobre o andamento da NettosCorp, com capacidade de aprendizado para aprimorar as interações com o fundador.

## 2. Jobs configurados

| Job | Frequência | O que faz |
|-----|------------|-----------|
| `feedback-diario` | Todo dia às 09:00 | Resumo do andamento das tarefas, relatórios dos agentes, bloqueios |
| `feedback-semanal` | Segunda às 08:00 | Relatório consolidado da semana, métricas, próximos passos |
| `verificacao-agentes` | A cada 6 horas | Verifica se os agentes estão ativos, heartbeat, status das tarefas delegadas |

## 3. Aprendizado de interações

O sistema registra cada interação em `cron/feedback/` para aprimoramento futuro:

- **O que foi comunicado** (tipo, conteúdo, canal)
- **Reação do fundador** (aprovou, rejeitou, pediu ajustes, ignorou)
- **Ajuste aplicado** (mudança de tom, frequência, nível de detalhamento)

Com isso, o feedback fica cada vez mais alinhado ao que o fundador valoriza.

## 4. Estrutura de arquivos

```
cron/
├── inteligente/
│   ├── configuracao.md        # Configuração dos jobs
│   ├── aprendizagem.md        # Regras de aprendizado de interações
│   └── templates/
│       ├── feedback-diario.md
│       └── feedback-semanal.md
├── logs/                      # Logs de execução dos jobs
└── feedback/                  # Histórico de interações para aprendizado
    └── interacoes.jsonl       # Registro JSONL de cada interação
```

## 5. Como funciona o aprendizado

1. Hermes envia feedback periódico
2. Fundador reage (aprova, rejeita, ajusta, ignora)
3. Hermes registra a reação em `interacoes.jsonl`
4. Na próxima iteração, Hermes ajusta tom, frequência e conteúdo baseado no histórico
5. Com o tempo, o feedback fica mais preciso e menos intrusivo

## 6. Exemplos de ajustes por aprendizado

| Reação do fundador | Ajuste aplicado |
|--------------------|-----------------|
| "Muito detalhado, resume mais" | Reduzir nível de detalhamento nos próximos feedbacks |
| "Só me avise se houver problema" | Enviar feedback apenas quando houver bloqueios |
| "Prefiro pela manhã" | Ajustar horário de envio para 08:00 |
| "Não envie aos fins de semana" | Desabilitar jobs em sábado e domingo |

## 7. Configuração no Hermes

Para ativar os jobs:

```bash
hermes cronjob create feedback-diario --schedule "0 9 * * *" --command "hermes cron:feedback --type diario"
hermes cronjob create feedback-semanal --schedule "0 8 * * 1" --command "hermes cron:feedback --type semanal"
hermes cronjob create verificacao-agentes --schedule "0 */6 * * *" --command "hermes cron:verificar-agentes"
```

---

**Arquivos:** `cron/inteligente/configuracao.md`, `cron/inteligente/aprendizagem.md`  
**Logs:** `cron/logs/`  
**Histórico:** `cron/feedback/interacoes.jsonl`
