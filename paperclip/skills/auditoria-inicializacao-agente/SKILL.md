---
name: auditoria-inicializacao-agente
description: Audita a inicialização de agentes do Paperclip, identifica falhas, agrupa erros semelhantes e entrega ao Claude apenas os casos relevantes para investigação técnica.
category: operacao
version: 1.0.0
metadata:
  origem: execucao_real
  ciclo: executar_observar_identificar_consolidar_testar
  nivel_esforço_medio: 2
  verificacao_independente: qa
---

# Auditoria de Inicialização de Agentes

Procedimento operacional consolidado a partir de investigação real de agentes do Paperclip.

## Objetivo

Verificar se agentes do Paperclip não apenas constam como `ready` no banco de dados, mas realmente inicializam, respondem e funcionam pelo fluxo normal.

## Contexto

Durante investigação recente, descobriu que `ready` no banco não é suficiente. Foram identificados problemas:
- Adaptador Windows (`python3` vs `python`)
- Verificação de inicialização do Hermes
- Agentes marcados como prontos sem resposta efetiva

## Passos

### 1. Consultar registros

Liste todos os agentes da empresa via API Paperclip.

### 2. Filtrar agentes com falhas

Identifique agentes com:
- Status diferente de `ready`
- Último heartbeat há mais de 15 minutos
- Erros recentes nos logs de execução

### 3. Identificar versões diferentes

Agrupe agentes por versão do adapter e versão do Hermes. Versões divergentes são suspeitas.

### 4. Agrupar erros semelhantes

Agrupe falhas por padrão de erro (ex.: `python3` não encontrado, timeout de conexão, falha de autenticação).

### 5. Eliminar redundância

Remova duplicatas. Fique com um caso representativo por grupo de erro.

### 6. Entregar ao Claude

Envie apenas os casos relevantes para investigação técnica. O Claude analisa o código, propõe a correção.

### 7. Acompanhar e validar

Hermes acompanha a implementação da correção. QA Tester verifica independentemente que o agente inicializa e responde.

### 8. Consolidar

Se a correção funcionar em duas execuções independentes, registre como skill reutilizável.

## Critérios de aceitação

- [ ] Todo agente com status `ready` responde a uma mensagem de teste
- [ ] Nenhum agente com falha de inicialização permanece sem investigação
- [ ] QA Tester confirmou independentemente o funcionamento após correção
- [ ] Evidência de verificação registrada no log de execução

## Verificação independente

Quem implementa a correção não valida o próprio trabalho. O QA Tester (ou outro agente) confirma que o agente inicializa e responde pelo fluxo normal antes da tarefa ser considerada concluída.
