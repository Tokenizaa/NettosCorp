# API INTERNA — SISTEMA OPERACIONAL NETTOSCORP

**Versão:** 1.0  
**Data:** 11 de novembro de 2026  
**Autor:** Hermes (Chefe de Gabinete Executivo)

O Sistema Operacional NettosCorp não possui uma API REST separada. A interação é feita através de:

1. **SQL direto no Supabase** — para leitura e escrita de dados
2. **Hermes (agente de IA único)** — para raciocínio, delegação e relatórios
3. **Frontend React/Vite (enterprise/)** — para interface visual

## Endpoints Lógicos (Operações Suportadas)

### Gestão de Agentes (Funções Organizacionais)

| Operação | SQL | Descrição |
|----------|-----|-----------|
| Listar agentes | `SELECT * FROM agents WHERE company_id = ...` | Lista todas as funções organizacionais |
| Atualizar status | `UPDATE agents SET status = ... WHERE code = ...` | Altera status de uma função |
| Atualizar heartbeat | `UPDATE agents SET last_heartbeat_at = NOW() WHERE code = ...` | Atualiza batimento de uma função |
| Atualizar capabilities | `UPDATE agents SET capabilities = ... WHERE code = ...` | Atualiza capacidades de uma função |

### Gestão de Goals (Objetivos)

| Operação | SQL | Descrição |
|----------|-----|-----------|
| Listar goals | `SELECT * FROM goals WHERE company_id = ...` | Lista todos os objetivos |
| Criar goal | `INSERT INTO goals ...` | Cria novo objetivo |
| Atualizar status | `UPDATE goals SET status = ... WHERE id = ...` | Altera status de objetivo |

### Gestão de Issues (Tarefas)

| Operação | SQL | Descrição |
|----------|-----|-----------|
| Listar issues | `SELECT * FROM issues WHERE company_id = ...` | Lista todas as tarefas |
| Criar issue | `INSERT INTO issues ...` | Cria nova tarefa |
| Atribuir issue | `UPDATE issues SET assignee_agent_id = ... WHERE id = ...` | Atribui tarefa a função |
| Atualizar status | `UPDATE issues SET status = ... WHERE id = ...` | Altera status da tarefa |

---

## 5. Contrato de Integração com Hermes

Hermes é acessado através do Telegram e de comandos diretos. Não há endpoint REST separado para Hermes.

### Comandos Suportados

| Comando | Descrição |
|---------|-----------|
| `/voice on` | Ativa modo voz-a-voz |
| `/voice tts` | Ativa modo sempre-voz |
| `/voice off` | Desativa áudio |
| Qualquer mensagem em português | Hermes processa e responde como Chefe de Gabinete Executivo |

---

## 6. Contrato de Integração com Supabase

O frontend enterprise (`enterprise/src/services/supabaseClient.ts`) conecta ao Supabase usando:

- `VITE_SUPABASE_URL`: `https://udeglcdloehagljrrukj.supabase.co`
- `VITE_SUPABASE_ANON_KEY`: [configurado no .env]

Quando o Supabase não está acessível, o frontend usa `localStore` (localStorage) como fallback.

---

**Assinado:** Hermes (Chefe de Gabinete Executivo)
