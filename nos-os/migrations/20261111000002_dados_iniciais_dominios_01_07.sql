-- ====================================================================
-- NOS-OS — Dados iniciais Domínios 01 e 07
-- Preserva agentes existentes; não exclui nada
-- ====================================================================

-- 1. Departamentos (baseado nos reports_to existentes)
INSERT INTO departments (company_id, code, name, description, status)
SELECT c.id, 'DEP-TEC', 'Tecnologia e Arquitetura', 'Engenharia de software, arquitetura de sistemas, backend, frontend, DevOps', 'active'
FROM companies c WHERE c.issue_prefix = 'NET'
ON CONFLICT (company_id, code) DO NOTHING;

INSERT INTO departments (company_id, code, name, description, status)
SELECT c.id, 'DEP-PROJ', 'Gestão de Projetos', 'Planejamento, carteira de projetos, prazos, entregas, dependências', 'active'
FROM companies c WHERE c.issue_prefix = 'NET'
ON CONFLICT (company_id, code) DO NOTHING;

INSERT INTO departments (company_id, code, name, description, status)
SELECT c.id, 'DEP-SUP', 'Suporte Operacional', 'Monitoramento, documentação, tarefas operacionais, atendimento', 'active'
FROM companies c WHERE c.issue_prefix = 'NET'
ON CONFLICT (company_id, code) DO NOTHING;

INSERT INTO departments (company_id, code, name, description, status)
SELECT c.id, 'DEP-GOV', 'Governança e Coordenação', 'Orquestração global, políticas, aprovações, auditoria', 'active'
FROM companies c WHERE c.issue_prefix = 'NET'
ON CONFLICT (company_id, code) DO NOTHING;

-- 2. Posições (mapeadas aos títulos existentes dos agentes)
INSERT INTO positions (company_id, department_id, code, title, level, description, status)
SELECT c.id, d.id, 'POS-CTO-001', 'Diretor de Tecnologia', 'C-Level', 'Definição de arquitetura empresarial, padrões técnicos, pilha de tecnologia', 'active'
FROM companies c, departments d
WHERE c.issue_prefix = 'NET' AND d.code = 'DEP-TEC'
ON CONFLICT (company_id, code) DO NOTHING;

INSERT INTO positions (company_id, department_id, code, title, level, description, status)
SELECT c.id, d.id, 'POS-DIR-PROJ-001', 'Diretor de Gestão de Projetos', 'Diretoria', 'Gerenciamento de carteira de projetos, prazos, entregas, riscos, dependências', 'active'
FROM companies c, departments d
WHERE c.issue_prefix = 'NET' AND d.code = 'DEP-PROJ'
ON CONFLICT (company_id, code) DO NOTHING;

INSERT INTO positions (company_id, department_id, code, title, level, description, status)
SELECT c.id, d.id, 'POS-ARCH-001', 'Arquiteto de Software', 'Especialista', 'Projeto de sistemas escaláveis, DDD, ADRs, estratégia de evolução', 'active'
FROM companies c, departments d
WHERE c.issue_prefix = 'NET' AND d.code = 'DEP-TEC'
ON CONFLICT (company_id, code) DO NOTHING;

INSERT INTO positions (company_id, department_id, code, title, level, description, status)
SELECT c.id, d.id, 'POS-BACK-001', 'Arquiteto de Backend', 'Especialista', 'Design de APIs, arquitetura de banco, escalabilidade', 'active'
FROM companies c, departments d
WHERE c.issue_prefix = 'NET' AND d.code = 'DEP-TEC'
ON CONFLICT (company_id, code) DO NOTHING;

INSERT INTO positions (company_id, department_id, code, title, level, description, status)
SELECT c.id, d.id, 'POS-FRONT-001', 'Desenvolvedor Frontend', 'Especialista', 'Implementação de UI, desenvolvimento de interfaces', 'active'
FROM companies c, departments d
WHERE c.issue_prefix = 'NET' AND d.code = 'DEP-TEC'
ON CONFLICT (company_id, code) DO NOTHING;

INSERT INTO positions (company_id, department_id, code, title, level, description, status)
SELECT c.id, d.id, 'POS-DEVOPS-001', 'Automatizador DevOps', 'Especialista', 'CI/CD, infraestrutura, cloud ops', 'active'
FROM companies c, departments d
WHERE c.issue_prefix = 'NET' AND d.code = 'DEP-TEC'
ON CONFLICT (company_id, code) DO NOTHING;

INSERT INTO positions (company_id, department_id, code, title, level, description, status)
SELECT c.id, d.id, 'POS-PM-001', 'Gerente de Projeto Senior', 'Especialista', 'Planejamento de projetos, acompanhamento de execução, gerenciamento de dependências', 'active'
FROM companies c, departments d
WHERE c.issue_prefix = 'NET' AND d.code = 'DEP-PROJ'
ON CONFLICT (company_id, code) DO NOTHING;

INSERT INTO positions (company_id, department_id, code, title, level, description, status)
SELECT c.id, d.id, 'POS-TW-001', 'Escritor Técnico', 'Especialista', 'Documentação técnica, criação e manutenção de docs, versionamento', 'active'
FROM companies c, departments d
WHERE c.issue_prefix = 'NET' AND d.code = 'DEP-TEC'
ON CONFLICT (company_id, code) DO NOTHING;

INSERT INTO positions (company_id, department_id, code, title, level, description, status)
SELECT c.id, d.id, 'POS-MON-001', 'Agente de Monitoramento', 'Suporte Operacional', 'Acompanhar plataforma enterprise, detectar falhas, reportar status, alertar Hermes', 'active'
FROM companies c, departments d
WHERE c.issue_prefix = 'NET' AND d.code = 'DEP-SUP'
ON CONFLICT (company_id, code) DO NOTHING;

INSERT INTO positions (company_id, department_id, code, title, level, description, status)
SELECT c.id, d.id, 'POS-DOC-001', 'Agente de Documentação', 'Suporte Operacional', 'Manter documentação atualizada, sincronizar institutional/, versionar documentos', 'active'
FROM companies c, departments d
WHERE c.issue_prefix = 'NET' AND d.code = 'DEP-SUP'
ON CONFLICT (company_id, code) DO NOTHING;

INSERT INTO positions (company_id, department_id, code, title, level, description, status)
SELECT c.id, d.id, 'POS-OPS-001', 'Agente Operacional', 'Suporte Operacional', 'Tarefas gerais, coordenação, lembretes, acompanhamento de prazos', 'active'
FROM companies c, departments d
WHERE c.issue_prefix = 'NET' AND d.code = 'DEP-SUP'
ON CONFLICT (company_id, code) DO NOTHING;

INSERT INTO positions (company_id, department_id, code, title, level, description, status)
SELECT c.id, d.id, 'POS-SUP-001', 'Agente de Atendimento', 'Suporte Operacional', 'Filtrar mensagens, responder dúvidas simples, escalar para Hermes', 'active'
FROM companies c, departments d
WHERE c.issue_prefix = 'NET' AND d.code = 'DEP-SUP'
ON CONFLICT (company_id, code) DO NOTHING;

INSERT INTO positions (company_id, department_id, code, title, level, description, status)
SELECT c.id, d.id, 'POS-ORC-001', 'Agente Corporativo Global de Orquestração', 'Coordenação', 'Coordenação técnica de distribuição de tarefas entre agentes e projetos', 'active'
FROM companies c, departments d
WHERE c.issue_prefix = 'NET' AND d.code = 'DEP-GOV'
ON CONFLICT (company_id, code) DO NOTHING;

INSERT INTO positions (company_id, department_id, code, title, level, description, status)
SELECT c.id, d.id, 'POS-HERMES-001', 'Chefe de Gabinete Executivo', 'Executivo', 'Único núcleo de raciocínio e decisão do sistema', 'active'
FROM companies c, departments d
WHERE c.issue_prefix = 'NET' AND d.code = 'DEP-GOV'
ON CONFLICT (company_id, code) DO NOTHING;

-- 3. Funções organizacionais (mapeando cada código de agent)
-- Hermes (única IA)
INSERT INTO functions (company_id, department_id, position_id, code, name, purpose, capabilities, is_ai, status)
SELECT c.id, d.id, p.id, 'HERMES-001', 'Hermes', 'Chefe de Gabinete Executivo — único núcleo de raciocínio e decisão',
       '["planejamento", "decomposicao", "execucao", "monitoramento", "auditoria"]'::jsonb, TRUE, 'active'
FROM companies c, departments d, positions p
WHERE c.issue_prefix = 'NET' AND d.code = 'DEP-GOV' AND p.code = 'POS-HERMES-001'
ON CONFLICT (company_id, code) DO NOTHING;

-- Diretores
INSERT INTO functions (company_id, department_id, position_id, code, name, purpose, capabilities, is_ai, status)
SELECT c.id, d.id, p.id, 'DIR-TEC-001', 'Diretor de Tecnologia', 'Função organizacional — não é agente de IA autônomo',
       '["arquitetura_empresarial", "padroes_tecnicos", "pilha_tecnologia", "engenharia", "infraestrutura"]'::jsonb, FALSE, 'active'
FROM companies c, departments d, positions p
WHERE c.issue_prefix = 'NET' AND d.code = 'DEP-TEC' AND p.code = 'POS-CTO-001'
ON CONFLICT (company_id, code) DO NOTHING;

INSERT INTO functions (company_id, department_id, position_id, code, name, purpose, capabilities, is_ai, status)
SELECT c.id, d.id, p.id, 'DIR-PROJ-001', 'Diretor de Gestão de Projetos', 'Função organizacional — não é agente de IA autônomo',
       '["carteira_projetos", "prazos", "entregas", "riscos", "dependencias"]'::jsonb, FALSE, 'active'
FROM companies c, departments d, positions p
WHERE c.issue_prefix = 'NET' AND d.code = 'DEP-PROJ' AND p.code = 'POS-DIR-PROJ-001'
ON CONFLICT (company_id, code) DO NOTHING;

-- Especialistas
INSERT INTO functions (company_id, department_id, position_id, code, name, purpose, capabilities, is_ai, status)
SELECT c.id, d.id, p.id, 'SPEC-ARCH-001', 'Arquiteto de Software', 'Função organizacional — não é agente de IA autônomo',
       '["sistemas_escalaveis", "ddd", "adrs", "evolucao_sistema"]'::jsonb, FALSE, 'active'
FROM companies c, departments d, positions p
WHERE c.issue_prefix = 'NET' AND d.code = 'DEP-TEC' AND p.code = 'POS-ARCH-001'
ON CONFLICT (company_id, code) DO NOTHING;

INSERT INTO functions (company_id, department_id, position_id, code, name, purpose, capabilities, is_ai, status)
SELECT c.id, d.id, p.id, 'SPEC-BACK-001', 'Arquiteto de Backend', 'Função organizacional — não é agente de IA autônomo',
       '["design_apis", "arquitetura_banco", "escalabilidade"]'::jsonb, FALSE, 'active'
FROM companies c, departments d, positions p
WHERE c.issue_prefix = 'NET' AND d.code = 'DEP-TEC' AND p.code = 'POS-BACK-001'
ON CONFLICT (company_id, code) DO NOTHING;

INSERT INTO functions (company_id, department_id, position_id, code, name, purpose, capabilities, is_ai, status)
SELECT c.id, d.id, p.id, 'SPEC-FRONT-001', 'Desenvolvedor Frontend', 'Função organizacional — não é agente de IA autônomo',
       '["implementacao_ui", "desenvolvimento_interfaces"]'::jsonb, FALSE, 'active'
FROM companies c, departments d, positions p
WHERE c.issue_prefix = 'NET' AND d.code = 'DEP-TEC' AND p.code = 'POS-FRONT-001'
ON CONFLICT (company_id, code) DO NOTHING;

INSERT INTO functions (company_id, department_id, position_id, code, name, purpose, capabilities, is_ai, status)
SELECT c.id, d.id, p.id, 'SPEC-DEVOPS-001', 'Automatizador DevOps', 'Função organizacional — não é agente de IA autônomo',
       '["cicd", "infraestrutura", "cloud_ops"]'::jsonb, FALSE, 'active'
FROM companies c, departments d, positions p
WHERE c.issue_prefix = 'NET' AND d.code = 'DEP-TEC' AND p.code = 'POS-DEVOPS-001'
ON CONFLICT (company_id, code) DO NOTHING;

INSERT INTO functions (company_id, department_id, position_id, code, name, purpose, capabilities, is_ai, status)
SELECT c.id, d.id, p.id, 'SPEC-PM-001', 'Gerente de Projeto Senior', 'Função organizacional — não é agente de IA autônomo',
       '["planejamento_projetos", "acompanhamento_execucao", "dependencias", "relatorio_status"]'::jsonb, FALSE, 'active'
FROM companies c, departments d, positions p
WHERE c.issue_prefix = 'NET' AND d.code = 'DEP-PROJ' AND p.code = 'POS-PM-001'
ON CONFLICT (company_id, code) DO NOTHING;

INSERT INTO functions (company_id, department_id, position_id, code, name, purpose, capabilities, is_ai, status)
SELECT c.id, d.id, p.id, 'SPEC-TW-001', 'Escritor Técnico', 'Função organizacional — não é agente de IA autônomo',
       '["documentacao_tecnica", "criacao_docs", "versionamento"]'::jsonb, FALSE, 'active'
FROM companies c, departments d, positions p
WHERE c.issue_prefix = 'NET' AND d.code = 'DEP-TEC' AND p.code = 'POS-TW-001'
ON CONFLICT (company_id, code) DO NOTHING;

-- Suporte operacional
INSERT INTO functions (company_id, department_id, position_id, code, name, purpose, capabilities, is_ai, status)
SELECT c.id, d.id, p.id, 'NET-AG-001', 'Monitor Enterprise', 'Função de suporte operacional — não é agente de IA autônomo',
       '["acompanhamento_plataforma", "detecao_falhas", "report_status", "alerta_hermes"]'::jsonb, FALSE, 'active'
FROM companies c, departments d, positions p
WHERE c.issue_prefix = 'NET' AND d.code = 'DEP-SUP' AND p.code = 'POS-MON-001'
ON CONFLICT (company_id, code) DO NOTHING;

INSERT INTO functions (company_id, department_id, position_id, code, name, purpose, capabilities, is_ai, status)
SELECT c.id, d.id, p.id, 'NET-AG-002', 'Documentação Institucional', 'Função de suporte operacional — não é agente de IA autônomo',
       '["documentacao_atualizada", "sincronizacao_institutional", "versionamento"]'::jsonb, FALSE, 'active'
FROM companies c, departments d, positions p
WHERE c.issue_prefix = 'NET' AND d.code = 'DEP-SUP' AND p.code = 'POS-DOC-001'
ON CONFLICT (company_id, code) DO NOTHING;

INSERT INTO functions (company_id, department_id, position_id, code, name, purpose, capabilities, is_ai, status)
SELECT c.id, d.id, p.id, 'NET-AG-003', 'Operacional', 'Função de suporte operacional — não é agente de IA autônomo',
       '["tarefas_gerais", "coordenacao", "lembretes", "prazos"]'::jsonb, FALSE, 'active'
FROM companies c, departments d, positions p
WHERE c.issue_prefix = 'NET' AND d.code = 'DEP-SUP' AND p.code = 'POS-OPS-001'
ON CONFLICT (company_id, code) DO NOTHING;

INSERT INTO functions (company_id, department_id, position_id, code, name, purpose, capabilities, is_ai, status)
SELECT c.id, d.id, p.id, 'NET-AG-004', 'Atendimento', 'Função de suporte operacional — não é agente de IA autônomo',
       '["filtrar_mensagens", "responder_duvidas", "escalar_para_hermes"]'::jsonb, FALSE, 'active'
FROM companies c, departments d, positions p
WHERE c.issue_prefix = 'NET' AND d.code = 'DEP-SUP' AND p.code = 'POS-SUP-001'
ON CONFLICT (company_id, code) DO NOTHING;

-- Orquestrador Global
INSERT INTO functions (company_id, department_id, position_id, code, name, purpose, capabilities, is_ai, status)
SELECT c.id, d.id, p.id, 'ORC-GLOBAL-001', 'Agente Corporativo Global de Orquestração', 'Função de coordenação — não é agente de IA autônomo',
       '["coordenacao_tecnica", "distribuicao_tarefas", "agentes_projetos"]'::jsonb, FALSE, 'active'
FROM companies c, departments d, positions p
WHERE c.issue_prefix = 'NET' AND d.code = 'DEP-GOV' AND p.code = 'POS-ORC-001'
ON CONFLICT (company_id, code) DO NOTHING;

-- 4. Atribuição de funções aos agentes existentes
INSERT INTO function_assignments (function_id, agent_id, assigned_by_agent_id)
SELECT f.id, a.id, h.id
FROM functions f
JOIN agents a ON a.code = f.code AND a.company_id = f.company_id
JOIN agents h ON h.code = 'HERMES-001' AND h.company_id = f.company_id
WHERE NOT EXISTS (SELECT 1 FROM function_assignments fa WHERE fa.function_id = f.id AND fa.agent_id = a.id);

-- 5. Papéis de governança (Domínio 07)
INSERT INTO roles (company_id, code, name, description, status)
SELECT c.id, 'SUPER_ADMIN', 'Super Administrador', 'Acesso total a todos os recursos', 'active'
FROM companies c WHERE c.issue_prefix = 'NET'
ON CONFLICT (company_id, code) DO NOTHING;

INSERT INTO roles (company_id, code, name, description, status)
SELECT c.id, 'DIRECTOR', 'Diretor', 'Acesso a recursos de diretoria e gestão', 'active'
FROM companies c WHERE c.issue_prefix = 'NET'
ON CONFLICT (company_id, code) DO NOTHING;

INSERT INTO roles (company_id, code, name, description, status)
SELECT c.id, 'MANAGER', 'Gerente', 'Acesso a recursos de gestão de projetos e tarefas', 'active'
FROM companies c WHERE c.issue_prefix = 'NET'
ON CONFLICT (company_id, code) DO NOTHING;

INSERT INTO roles (company_id, code, name, description, status)
SELECT c.id, 'SPECIALIST', 'Especialista', 'Acesso a recursos de execução técnica', 'active'
FROM companies c WHERE c.issue_prefix = 'NET'
ON CONFLICT (company_id, code) DO NOTHING;

INSERT INTO roles (company_id, code, name, description, status)
SELECT c.id, 'SUPPORT', 'Suporte Operacional', 'Acesso a recursos de suporte e monitoramento', 'active'
FROM companies c WHERE c.issue_prefix = 'NET'
ON CONFLICT (company_id, code) DO NOTHING;

INSERT INTO roles (company_id, code, name, description, status)
SELECT c.id, 'EXECUTIVE', 'Executivo', 'Acesso total — Hermes como Chefe de Gabinete Executivo', 'active'
FROM companies c WHERE c.issue_prefix = 'NET'
ON CONFLICT (company_id, code) DO NOTHING;

-- 6. Matriz de permissões por papel (negar por padrão; permitir explicitamente)
-- Super Admin: tudo
INSERT INTO role_permissions (role_id, resource, action, effect, conditions)
SELECT r.id, '*', '*', 'allow', '{}'::jsonb
FROM roles r WHERE r.code = 'SUPER_ADMIN'
ON CONFLICT (role_id, resource, action) DO NOTHING;

-- Diretor: leitura geral, escrita em departamentos, projetos, decisões
INSERT INTO role_permissions (role_id, resource, action, effect, conditions)
SELECT r.id, 'departments', 'read', 'allow', '{}'::jsonb FROM roles r WHERE r.code = 'DIRECTOR'
ON CONFLICT (role_id, resource, action) DO NOTHING;
INSERT INTO role_permissions (role_id, resource, action, effect, conditions)
SELECT r.id, 'departments', 'write', 'allow', '{}'::jsonb FROM roles r WHERE r.code = 'DIRECTOR'
ON CONFLICT (role_id, resource, action) DO NOTHING;
INSERT INTO role_permissions (role_id, resource, action, effect, conditions)
SELECT r.id, 'projects', 'read', 'allow', '{}'::jsonb FROM roles r WHERE r.code = 'DIRECTOR'
ON CONFLICT (role_id, resource, action) DO NOTHING;
INSERT INTO role_permissions (role_id, resource, action, effect, conditions)
SELECT r.id, 'projects', 'write', 'allow', '{}'::jsonb FROM roles r WHERE r.code = 'DIRECTOR'
ON CONFLICT (role_id, resource, action) DO NOTHING;
INSERT INTO role_permissions (role_id, resource, action, effect, conditions)
SELECT r.id, 'decisions', 'read', 'allow', '{}'::jsonb FROM roles r WHERE r.code = 'DIRECTOR'
ON CONFLICT (role_id, resource, action) DO NOTHING;
INSERT INTO role_permissions (role_id, resource, action, effect, conditions)
SELECT r.id, 'decisions', 'write', 'allow', '{}'::jsonb FROM roles r WHERE r.code = 'DIRECTOR'
ON CONFLICT (role_id, resource, action) DO NOTHING;

-- Gerente: leitura e escrita em projetos, tarefas, issues
INSERT INTO role_permissions (role_id, resource, action, effect, conditions)
SELECT r.id, 'projects', 'read', 'allow', '{}'::jsonb FROM roles r WHERE r.code = 'MANAGER'
ON CONFLICT (role_id, resource, action) DO NOTHING;
INSERT INTO role_permissions (role_id, resource, action, effect, conditions)
SELECT r.id, 'projects', 'write', 'allow', '{}'::jsonb FROM roles r WHERE r.code = 'MANAGER'
ON CONFLICT (role_id, resource, action) DO NOTHING;
INSERT INTO role_permissions (role_id, resource, action, effect, conditions)
SELECT r.id, 'issues', 'read', 'allow', '{}'::jsonb FROM roles r WHERE r.code = 'MANAGER'
ON CONFLICT (role_id, resource, action) DO NOTHING;
INSERT INTO role_permissions (role_id, resource, action, effect, conditions)
SELECT r.id, 'issues', 'write', 'allow', '{}'::jsonb FROM roles r WHERE r.code = 'MANAGER'
ON CONFLICT (role_id, resource, action) DO NOTHING;

-- Especialista: leitura e escrita em issues atribuídas
INSERT INTO role_permissions (role_id, resource, action, effect, conditions)
SELECT r.id, 'issues', 'read', 'allow', '{}'::jsonb FROM roles r WHERE r.code = 'SPECIALIST'
ON CONFLICT (role_id, resource, action) DO NOTHING;
INSERT INTO role_permissions (role_id, resource, action, effect, conditions)
SELECT r.id, 'issues', 'write', 'allow', '{"assignee_only": true}'::jsonb FROM roles r WHERE r.code = 'SPECIALIST'
ON CONFLICT (role_id, resource, action) DO NOTHING;

-- Suporte: leitura em issues, escrita em issues de suporte
INSERT INTO role_permissions (role_id, resource, action, effect, conditions)
SELECT r.id, 'issues', 'read', 'allow', '{}'::jsonb FROM roles r WHERE r.code = 'SUPPORT'
ON CONFLICT (role_id, resource, action) DO NOTHING;
INSERT INTO role_permissions (role_id, resource, action, effect, conditions)
SELECT r.id, 'issues', 'write', 'allow', '{"department": "suporte_operacional"}'::jsonb FROM roles r WHERE r.code = 'SUPPORT'
ON CONFLICT (role_id, resource, action) DO NOTHING;

-- Executivo (Hermes): tudo exceto decisões estratégicas do fundador
INSERT INTO role_permissions (role_id, resource, action, effect, conditions)
SELECT r.id, '*', '*', 'allow', '{}'::jsonb FROM roles r WHERE r.code = 'EXECUTIVE'
ON CONFLICT (role_id, resource, action) DO NOTHING;

-- 7. Referências de segredos (não armazena valores)
INSERT INTO secret_references (company_id, name, description, provider, secret_path, status)
SELECT c.id, 'SUPABASE_PASSWORD', 'Senha de acesso ao PostgreSQL do Supabase', 'environment_variable', 'SUPABASE_PASSWORD', 'active'
FROM companies c WHERE c.issue_prefix = 'NET'
ON CONFLICT (company_id, name) DO NOTHING;

INSERT INTO secret_references (company_id, name, description, provider, secret_path, status)
SELECT c.id, 'SUPABASE_ANON_KEY', 'Chave anon do Supabase para acesso via API', 'environment_variable', 'SUPABASE_ANON_KEY', 'active'
FROM companies c WHERE c.issue_prefix = 'NET'
ON CONFLICT (company_id, name) DO NOTHING;

-- 8. Relatório final
SELECT 'DEPARTAMENTOS' as entidade, COUNT(*) as total FROM departments
UNION ALL SELECT 'POSICOES', COUNT(*) FROM positions
UNION ALL SELECT 'FUNCOES', COUNT(*) FROM functions
UNION ALL SELECT 'FUNCIONAMENTOS_ATRIBUICOES', COUNT(*) FROM function_assignments
UNION ALL SELECT 'ROLES', COUNT(*) FROM roles
UNION ALL SELECT 'PERMISSOES', COUNT(*) FROM role_permissions
UNION ALL SELECT 'SEGREDOS_REFERENCIADOS', COUNT(*) FROM secret_references;
