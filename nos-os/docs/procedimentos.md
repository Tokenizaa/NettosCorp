# PROCEDIMENTOS OPERACIONAIS — SISTEMA OPERACIONAL NETTOSCORP

**Versão:** 1.0  
**Data:** 11 de novembro de 2026  
**Autor:** Hermes (Chefe de Gabinete Executivo)

Este documento descreve os procedimentos operacionais padrão do Sistema Operacional NettosCorp.

## 1. Delegação de Tarefas

Hermes (único agente de IA) é responsável por decompor solicitações do fundador em tarefas operacionais e atribuí-las a funções organizacionais.

### Fluxo de Delegação

1. **Recebimento:** Hermes recebe solicitação do fundador.
2. **Decomposição:** Hermes quebra a solicitação em tarefas específicas.
3. **Atribuição:** Cada tarefa é atribuída a uma função organizacional existente na tabela `agents`.
4. **Registro:** A tarefa é inserida na tabela `issues` com status `backlog`.
5. **Acompanhamento:** Hermes monitora o status da tarefa via consultas SQL ao Supabase.
6. **Conclusão:** Quando a tarefa é concluída, Hermes atualiza o status para `concluido` e gera relatório.

### Exemplo de Atribuição

| Tarefa | Função Responsável | Código da Função |
|--------|-------------------|------------------|
| Validar arquitetura de sistemas | Software Architect | SPEC-ARCH-001 |
| Configurar CI/CD | DevOps Automator | SPEC-DEVOPS-001 |
| Planejar projetos Q1 | Project Manager Senior | SPEC-PM-001 |
| Criar documentação técnica | Technical Writer | SPEC-TW-001 |
| Verificar saúde da plataforma | Monitor Enterprise | NET-AG-001 |

---

## 2. Monitoramento de Heartbeat

Cada função organizacional tem um campo `last_heartbeat_at` na tabela `agents`. Hermes verifica periodicamente se as funções estão ativas.

### Procedimento de Verificação

1. Hermes consulta a tabela `agents` para listar todas as funções.
2. Verifica o campo `last_heartbeat_at` de cada função.
3. Se o heartbeat está desatualizado (mais de 24 horas), Hermes marca a função como necessitando atenção.
4. Hermes gera relatório de status para o fundador.

### Comandos SQL de Monitoramento

```sql
-- Verificar agentes sem heartbeat recente
SELECT code, name, role, last_heartbeat_at
FROM agents
WHERE company_id = (SELECT id FROM companies WHERE issue_prefix = 'NET' ORDER BY created_at DESC LIMIT 1)
AND (last_heartbeat_at IS NULL OR last_heartbeat_at < NOW() - INTERVAL '24 hours')
ORDER BY last_heartbeat_at;

-- Verificar status de todas as funções
SELECT code, name, role, status, last_heartbeat_at
FROM agents
WHERE company_id = (SELECT id FROM companies WHERE issue_prefix = 'NET' ORDER BY created_at DESC LIMIT 1)
ORDER BY role, code;
```

---

## 3. Geração de Relatórios

Hermes gera relatórios periódicos para o fundador:

### Relatório Diário
- Status de todas as funções organizacionais
- Tarefas concluídas nas últimas 24 horas
- Tarefas em andamento
- Tarefas em backlog
- Bloqueios identificados

### Relatório Semanal
- Métricas da semana (tarefas concluídas, tempo médio, etc.)
- O que foi feito
- O que está em andamento
- Plano para próxima semana

### Relatório de Exceção
- Enviado imediatamente quando há bloqueio crítico
- Função sem heartbeat por mais de 24 horas
- Tarefa com prazo expirado

---

## 4. Gestão de Permissões

Cada função organizacional tem um campo `permissions` (jsonb) na tabela `agents`. As permissões são definidas pelo fundador e armazenadas como JSON.

### Estrutura de Permissões

```json
{
  "can_create_issues": true,
  "can_update_issues": true,
  "can_delete_issues": false,
  "can_create_goals": false,
  "can_access_supabase": true,
  "can_access_paperclip_api": false,
  "can_modify_budget": false
}
```

Hermes não altera permissões sem autorização do fundador.

---

## 5. Regras de Operação

| Regra | Descrição |
|-------|-----------|
| Hermes é o único agente de IA | Nenhuma outra função executa raciocínio autônomo |
| Não há agentes autônomos | Todas as demais funções são organizacionais, não IA |
| Não há integração com API Paperclip | O sistema opera de forma independente |
| Dados são preservados | Nada é excluído sem autorização do fundador |
| Orçamentos são zero por padrão | Definidos apenas pelo fundador |
| Permissões são vazias por padrão | Definidas apenas pelo fundador |
