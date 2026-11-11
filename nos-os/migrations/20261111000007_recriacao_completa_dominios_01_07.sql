-- ====================================================================
-- NOS-OS — Limpeza completa e recriação nos domínios 01 e 07
-- Mantém apenas empresa correta (aa266f39)
-- ====================================================================

-- 1. Remover TUDO de ambas as empresas nas tabelas dos domínios 01 e 07
DELETE FROM secret_references WHERE company_id IN ('0095c3ef-3500-4564-8618-702df4d9d308', 'aa266f39-5817-45d2-830b-6eb1bd0df173');
DELETE FROM role_permissions WHERE role_id IN (SELECT id FROM roles WHERE company_id IN ('0095c3ef-3500-4564-8618-702df4d9d308', 'aa266f39-5817-45d2-830b-6eb1bd0df173'));
DELETE FROM roles WHERE company_id IN ('0095c3ef-3500-4564-8618-702df4d9d308', 'aa266f39-5817-45d2-830b-6eb1bd0df173');
DELETE FROM function_assignments WHERE function_id IN (SELECT id FROM functions WHERE company_id IN ('0095c3ef-3500-4564-8618-702df4d9d308', 'aa266f39-5817-45d2-830b-6eb1bd0df173'));
DELETE FROM functions WHERE company_id IN ('0095c3ef-3500-4564-8618-702df4d9d308', 'aa266f39-5817-45d2-830b-6eb1bd0df173');
DELETE FROM positions WHERE company_id IN ('0095c3ef-3500-4564-8618-702df4d9d308', 'aa266f39-5817-45d2-830b-6eb1bd0df173');
DELETE FROM departments WHERE company_id IN ('0095c3ef-3500-4564-8618-702df4d9d308', 'aa266f39-5817-45d2-830b-6eb1bd0df173');

-- 2. Recriar departamentos na empresa correta
INSERT INTO departments (company_id, code, name, description, status)
SELECT 'aa266f39-5817-45d2-830b-6eb1bd0df173', v.code, v.name, v.description, 'active'
FROM (VALUES
  ('DEP-TEC', 'Tecnologia e Arquitetura', 'Engenharia de software, arquitetura de sistemas, backend, frontend, DevOps'),
  ('DEP-PROJ', 'Gestão de Projetos', 'Planejamento, carteira de projetos, prazos, entregas, dependências'),
  ('DEP-SUP', 'Suporte Operacional', 'Monitoramento, documentação, tarefas operacionais, atendimento'),
  ('DEP-GOV', 'Governança e Coordenação', 'Orquestração global, políticas, aprovações, auditoria')
) AS v(code, name, description);

-- 3. Recriar posições na empresa correta
INSERT INTO positions (company_id, department_id, code, title, level, description, status)
SELECT 'aa266f39-5817-45d2-830b-6eb1bd0df173', d.id, v.code, v.title, v.level, v.description, 'active'
FROM departments d
CROSS JOIN (VALUES
  ('POS-CTO-001', 'Diretor de Tecnologia', 'C-Level', 'Definição de arquitetura empresarial, padrões técnicos, pilha de tecnologia', 'DEP-TEC'),
  ('POS-DIR-PROJ-001', 'Diretor de Gestão de Projetos', 'Diretoria', 'Gerenciamento de carteira de projetos, prazos, entregas, riscos, dependências', 'DEP-PROJ'),
  ('POS-ARCH-001', 'Arquiteto de Software', 'Especialista', 'Projeto de sistemas escaláveis, DDD, ADRs, estratégia de evolução', 'DEP-TEC'),
  ('POS-BACK-001', 'Arquiteto de Backend', 'Especialista', 'Design de APIs, arquitetura de banco, escalabilidade', 'DEP-TEC'),
  ('POS-FRONT-001', 'Desenvolvedor Frontend', 'Especialista', 'Implementação de UI, desenvolvimento de interfaces', 'DEP-TEC'),
  ('POS-DEVOPS-001', 'Automatizador DevOps', 'Especialista', 'CI/CD, infraestrutura, cloud ops', 'DEP-TEC'),
  ('POS-PM-001', 'Gerente de Projeto Senior', 'Especialista', 'Planejamento de projetos, acompanhamento de execução, gerenciamento de dependências', 'DEP-PROJ'),
  ('POS-TW-001', 'Escritor Técnico', 'Especialista', 'Documentação técnica, criação e manutenção de docs, versionamento', 'DEP-TEC'),
  ('POS-MON-001', 'Agente de Monitoramento', 'Suporte Operacional', 'Acompanhar plataforma enterprise, detectar falhas, reportar status, alertar Hermes', 'DEP-SUP'),
  ('POS-DOC-001', 'Agente de Documentação', 'Suporte Operacional', 'Manter documentação atualizada, sincronizar institutional/, versionar documentos', 'DEP-SUP'),
  ('POS-OPS-001', 'Agente Operacional', 'Suporte Operacional', 'Tarefas gerais, coordenação, lembretes, acompanhamento de prazos', 'DEP-SUP'),
  ('POS-SUP-001', 'Agente de Atendimento', 'Suporte Operacional', 'Filtrar mensagens, responder dúvidas simples, escalar para Hermes', 'DEP-SUP'),
  ('POS-ORC-001', 'Agente Corporativo Global de Orquestração', 'Coordenação', 'Coordenação técnica de distribuição de tarefas entre agentes e projetos', 'DEP-GOV'),
  ('POS-HERMES-001', 'Chefe de Gabinete Executivo', 'Executivo', 'Único núcleo de raciocínio e decisão do sistema', 'DEP-GOV')
) AS v(code, title, level, description, dept_code)
WHERE d.code = v.dept_code;

-- 4. Recriar funções na empresa correta
INSERT INTO functions (company_id, department_id, position_id, code, name, purpose, capabilities, is_ai, status)
SELECT 'aa266f39-5817-45d2-830b-6eb1bd0df173', d.id, p.id, v.code, v.name, v.purpose, v.capabilities::jsonb, v.is_ai, 'active'
FROM departments d
CROSS JOIN positions p
CROSS JOIN (VALUES
  ('HERMES-001', 'Hermes', 'Chefe de Gabinete Executivo — único núcleo de raciocínio e decisão', '["planejamento", "decomposicao", "execucao", "monitoramento", "auditoria"]', true, 'DEP-GOV', 'POS-HERMES-001'),
  ('DIR-TEC-001', 'Diretor de Tecnologia', 'Função organizacional — não é agente de IA autônomo', '["arquitetura_empresarial", "padroes_tecnicos", "pilha_tecnologia", "engenharia", "infraestrutura"]', false, 'DEP-TEC', 'POS-CTO-001'),
  ('DIR-PROJ-001', 'Diretor de Gestão de Projetos', 'Função organizacional — não é agente de IA autônomo', '["carteira_projetos", "prazos", "entregas", "riscos", "dependencias"]', false, 'DEP-PROJ', 'POS-DIR-PROJ-001'),
  ('SPEC-ARCH-001', 'Arquiteto de Software', 'Função organizacional — não é agente de IA autônomo', '["sistemas_escalaveis", "ddd", "adrs", "evolucao_sistema"]', false, 'DEP-TEC', 'POS-ARCH-001'),
  ('SPEC-BACK-001', 'Arquiteto de Backend', 'Função organizacional — não é agente de IA autônomo', '["design_apis", "arquitetura_banco", "escalabilidade"]', false, 'DEP-TEC', 'POS-BACK-001'),
  ('SPEC-FRONT-001', 'Desenvolvedor Frontend', 'Função organizacional — não é agente de IA autônomo', '["implementacao_ui", "desenvolvimento_interfaces"]', false, 'DEP-TEC', 'POS-FRONT-001'),
  ('SPEC-DEVOPS-001', 'Automatizador DevOps', 'Função organizacional — não é agente de IA autônomo', '["cicd", "infraestrutura", "cloud_ops"]', false, 'DEP-TEC', 'POS-DEVOPS-001'),
  ('SPEC-PM-001', 'Gerente de Projeto Senior', 'Função organizacional — não é agente de IA autônomo', '["planejamento_projetos", "acompanhamento_execucao", "dependencias", "relatorio_status"]', false, 'DEP-PROJ', 'POS-PM-001'),
  ('SPEC-TW-001', 'Escritor Técnico', 'Função organizacional — não é agente de IA autônomo', '["documentacao_tecnica", "criacao_docs", "versionamento"]', false, 'DEP-TEC', 'POS-TW-001'),
  ('NET-AG-001', 'Monitor Enterprise', 'Função de suporte operacional — não é agente de IA autônomo', '["acompanhamento_plataforma", "detecao_falhas", "report_status", "alerta_hermes"]', false, 'DEP-SUP', 'POS-MON-001'),
  ('NET-AG-002', 'Documentação Institucional', 'Função de suporte operacional — não é agente de IA autônomo', '["documentacao_atualizada", "sincronizacao_institutional", "versionamento"]', false, 'DEP-SUP', 'POS-DOC-001'),
  ('NET-AG-003', 'Operacional', 'Função de suporte operacional — não é agente de IA autônomo', '["tarefas_gerais", "coordenacao", "lembretes", "prazos"]', false, 'DEP-SUP', 'POS-OPS-001'),
  ('NET-AG-004', 'Atendimento', 'Função de suporte operacional — não é agente de IA autônomo', '["filtrar_mensagens", "responder_duvidas", "escalar_para_hermes"]', false, 'DEP-SUP', 'POS-SUP-001'),
  ('ORC-GLOBAL-001', 'Agente Corporativo Global de Orquestração', 'Função de coordenação — não é agente de IA autônomo', '["coordenacao_tecnica", "distribuicao_tarefas", "agentes_projetos"]', false, 'DEP-GOV', 'POS-ORC-001')
) AS v(code, name, purpose, capabilities, is_ai, dept_code, pos_code)
WHERE d.code = v.dept_code AND p.code = v.pos_code;

-- 5. Recriar atribuições de função aos agentes existentes
INSERT INTO function_assignments (function_id, agent_id, assigned_by_agent_id)
SELECT f.id, a.id, h.id
FROM functions f
JOIN agents a ON a.code = f.code AND a.company_id = f.company_id
JOIN agents h ON h.code = 'HERMES-001' AND h.company_id = f.company_id;

-- 6. Recriar papéis de governança
INSERT INTO roles (company_id, code, name, description, status)
SELECT 'aa266f39-5817-45d2-830b-6eb1bd0df173', v.code, v.name, v.description, 'active'
FROM (VALUES
  ('SUPER_ADMIN', 'Super Administrador', 'Acesso total a todos os recursos'),
  ('DIRECTOR', 'Diretor', 'Acesso a recursos de diretoria e gestão'),
  ('MANAGER', 'Gerente', 'Acesso a recursos de gestão de projetos e tarefas'),
  ('SPECIALIST', 'Especialista', 'Acesso a recursos de execução técnica'),
  ('SUPPORT', 'Suporte Operacional', 'Acesso a recursos de suporte e monitoramento'),
  ('EXECUTIVE', 'Executivo', 'Acesso total — Hermes como Chefe de Gabinete Executivo')
) AS v(code, name, description);

-- 7. Recriar matriz de permissões
INSERT INTO role_permissions (role_id, resource, action, effect, conditions)
SELECT r.id, '*', '*', 'allow', '{}'::jsonb FROM roles r WHERE r.code = 'SUPER_ADMIN';

INSERT INTO role_permissions (role_id, resource, action, effect, conditions)
SELECT r.id, 'departments', 'read', 'allow', '{}'::jsonb FROM roles r WHERE r.code = 'DIRECTOR';
INSERT INTO role_permissions (role_id, resource, action, effect, conditions)
SELECT r.id, 'departments', 'write', 'allow', '{}'::jsonb FROM roles r WHERE r.code = 'DIRECTOR';
INSERT INTO role_permissions (role_id, resource, action, effect, conditions)
SELECT r.id, 'projects', 'read', 'allow', '{}'::jsonb FROM roles r WHERE r.code = 'DIRECTOR';
INSERT INTO role_permissions (role_id, resource, action, effect, conditions)
SELECT r.id, 'projects', 'write', 'allow', '{}'::jsonb FROM roles r WHERE r.code = 'DIRECTOR';
INSERT INTO role_permissions (role_id, resource, action, effect, conditions)
SELECT r.id, 'decisions', 'read', 'allow', '{}'::jsonb FROM roles r WHERE r.code = 'DIRECTOR';
INSERT INTO role_permissions (role_id, resource, action, effect, conditions)
SELECT r.id, 'decisions', 'write', 'allow', '{}'::jsonb FROM roles r WHERE r.code = 'DIRECTOR';

INSERT INTO role_permissions (role_id, resource, action, effect, conditions)
SELECT r.id, 'projects', 'read', 'allow', '{}'::jsonb FROM roles r WHERE r.code = 'MANAGER';
INSERT INTO role_permissions (role_id, resource, action, effect, conditions)
SELECT r.id, 'projects', 'write', 'allow', '{}'::jsonb FROM roles r WHERE r.code = 'MANAGER';
INSERT INTO role_permissions (role_id, resource, action, effect, conditions)
SELECT r.id, 'issues', 'read', 'allow', '{}'::jsonb FROM roles r WHERE r.code = 'MANAGER';
INSERT INTO role_permissions (role_id, resource, action, effect, conditions)
SELECT r.id, 'issues', 'write', 'allow', '{}'::jsonb FROM roles r WHERE r.code = 'MANAGER';

INSERT INTO role_permissions (role_id, resource, action, effect, conditions)
SELECT r.id, 'issues', 'read', 'allow', '{}'::jsonb FROM roles r WHERE r.code = 'SPECIALIST';
INSERT INTO role_permissions (role_id, resource, action, effect, conditions)
SELECT r.id, 'issues', 'write', 'allow', '{"assignee_only": true}'::jsonb FROM roles r WHERE r.code = 'SPECIALIST';

INSERT INTO role_permissions (role_id, resource, action, effect, conditions)
SELECT r.id, 'issues', 'read', 'allow', '{}'::jsonb FROM roles r WHERE r.code = 'SUPPORT';
INSERT INTO role_permissions (role_id, resource, action, effect, conditions)
SELECT r.id, 'issues', 'write', 'allow', '{"department": "suporte_operacional"}'::jsonb FROM roles r WHERE r.code = 'SUPPORT';

INSERT INTO role_permissions (role_id, resource, action, effect, conditions)
SELECT r.id, '*', '*', 'allow', '{}'::jsonb FROM roles r WHERE r.code = 'EXECUTIVE';

-- 8. Recriar referências de segredos
INSERT INTO secret_references (company_id, name, description, provider, secret_path, status)
SELECT 'aa266f39-5817-45d2-830b-6eb1bd0df173', v.name, v.description, v.provider, v.secret_path, 'active'
FROM (VALUES
  ('SUPABASE_PASSWORD', 'Senha de acesso ao PostgreSQL do Supabase', 'environment_variable', 'SUPABASE_PASSWORD'),
  ('SUPABASE_ANON_KEY', 'Chave anon do Supabase para acesso via API', 'environment_variable', 'SUPABASE_ANON_KEY')
) AS v(name, description, provider, secret_path);

-- 9. Relatório final
SELECT 'DEPARTAMENTOS' as entidade, COUNT(*) as total FROM departments
UNION ALL SELECT 'POSICOES', COUNT(*) FROM positions
UNION ALL SELECT 'FUNCOES', COUNT(*) FROM functions
UNION ALL SELECT 'ATRIBUICOES', COUNT(*) FROM function_assignments
UNION ALL SELECT 'ROLES', COUNT(*) FROM roles
UNION ALL SELECT 'PERMISSOES', COUNT(*) FROM role_permissions
UNION ALL SELECT 'SEGREDOS', COUNT(*) FROM secret_references;
