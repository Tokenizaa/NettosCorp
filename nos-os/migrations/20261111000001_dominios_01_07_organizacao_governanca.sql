-- ====================================================================
-- NOS-OS — Migration Domínios 01 e 07
-- Organização, Governança e Segurança
-- Versão: 20261111000001
-- ====================================================================

-- Habilitar extensões
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ====================================================================
-- DOMÍNIO 01 — ORGANIZAÇÃO E ORGANOGRAMA
-- ====================================================================

-- Departamentos
CREATE TABLE IF NOT EXISTS departments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    code VARCHAR(50) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    manager_agent_id UUID,
    parent_id UUID REFERENCES departments(id) ON DELETE SET NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (company_id, code)
);

-- Posições / Cargos
CREATE TABLE IF NOT EXISTS positions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    department_id UUID NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
    code VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    level VARCHAR(100) NOT NULL,
    description TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (company_id, code)
);

-- Funções organizacionais (não são agentes de IA)
CREATE TABLE IF NOT EXISTS functions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    department_id UUID NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
    position_id UUID REFERENCES positions(id) ON DELETE SET NULL,
    code VARCHAR(50) NOT NULL,
    name VARCHAR(255) NOT NULL,
    purpose TEXT,
    capabilities JSONB NOT NULL DEFAULT '[]'::jsonb,
    reports_to_function_id UUID REFERENCES functions(id) ON DELETE SET NULL,
    is_ai BOOLEAN NOT NULL DEFAULT FALSE,
    status VARCHAR(50) NOT NULL DEFAULT 'active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (company_id, code)
);

-- Atribuição de agente (função organizacional) a registro de agent existente
CREATE TABLE IF NOT EXISTS function_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    function_id UUID NOT NULL REFERENCES functions(id) ON DELETE CASCADE,
    agent_id UUID REFERENCES agents(id) ON DELETE SET NULL,
    assigned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    assigned_by_agent_id UUID,
    UNIQUE (function_id, agent_id)
);

-- Índices domínio 01
CREATE INDEX IF NOT EXISTS idx_departments_company ON departments(company_id);
CREATE INDEX IF NOT EXISTS idx_positions_department ON positions(department_id);
CREATE INDEX IF NOT EXISTS idx_functions_department ON functions(department_id);
CREATE INDEX IF NOT EXISTS idx_functions_code ON functions(code);
CREATE INDEX IF NOT EXISTS idx_function_assignments_function ON function_assignments(function_id);
CREATE INDEX IF NOT EXISTS idx_function_assignments_agent ON function_assignments(agent_id);

-- ====================================================================
-- DOMÍNIO 07 — GOVERNANÇA E SEGURANÇA
-- ====================================================================

-- Papéis de permissão
CREATE TABLE IF NOT EXISTS roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    code VARCHAR(50) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (company_id, code)
);

-- Matriz de permissões por papel
CREATE TABLE IF NOT EXISTS role_permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    resource VARCHAR(100) NOT NULL,
    action VARCHAR(50) NOT NULL,
    effect VARCHAR(10) NOT NULL DEFAULT 'allow' CHECK (effect IN ('allow', 'deny')),
    conditions JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (role_id, resource, action)
);

-- Índices domínio 07
CREATE INDEX IF NOT EXISTS idx_roles_company ON roles(company_id);
CREATE INDEX IF NOT EXISTS idx_role_permissions_role ON role_permissions(role_id);

-- Solicitações de aprovação
CREATE TABLE IF NOT EXISTS approvals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    resource_type VARCHAR(100) NOT NULL,
    resource_id UUID NOT NULL,
    action VARCHAR(100) NOT NULL,
    requested_by_agent_id UUID,
    requested_by_user_id UUID,
    approver_agent_id UUID,
    approver_user_id UUID,
    status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'expired')),
    justification TEXT,
    decided_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_approvals_company ON approvals(company_id);
CREATE INDEX IF NOT EXISTS idx_approvals_status ON approvals(status);

-- Referências de segredos (não armazena valores, apenas metadados)
CREATE TABLE IF NOT EXISTS secret_references (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    provider VARCHAR(100) NOT NULL,
    secret_path VARCHAR(500) NOT NULL,
    last_rotated_at TIMESTAMPTZ,
    rotation_due_at TIMESTAMPTZ,
    status VARCHAR(50) NOT NULL DEFAULT 'active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_secret_references_company ON secret_references(company_id);

-- Eventos de auditoria de segurança
CREATE TABLE IF NOT EXISTS audit_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    actor_agent_id UUID,
    actor_user_id UUID,
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(100) NOT NULL,
    resource_id UUID,
    effect VARCHAR(10) NOT NULL CHECK (effect IN ('allow', 'deny')),
    authorization_decision VARCHAR(50) NOT NULL,
    details JSONB NOT NULL DEFAULT '{}'::jsonb,
    ip_address VARCHAR(100),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_events_company ON audit_events(company_id);
CREATE INDEX IF NOT EXISTS idx_audit_events_created ON audit_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_events_action ON audit_events(action);

-- ====================================================================
-- DOMÍNIO 06 — MEMÓRIA E CONTEXTO INSTITUCIONAL (inicial)
-- ====================================================================

-- Decisões tomadas por Hermes
CREATE TABLE IF NOT EXISTS decisions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    code VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    summary TEXT NOT NULL,
    rationale TEXT NOT NULL,
    decided_by_agent_id UUID NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'active',
    related_goal_id UUID,
    related_issue_id UUID,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (company_id, code)
);

CREATE INDEX IF NOT EXISTS idx_decisions_company ON decisions(company_id);
CREATE INDEX IF NOT EXISTS idx_decisions_code ON decisions(code);

-- ====================================================================
-- Comentários de documentação
-- ====================================================================
COMMENT ON TABLE departments IS 'Departamentos organizacionais (Domínio 01)';
COMMENT ON TABLE positions IS 'Posições/cargos organizacionais (Domínio 01)';
COMMENT ON TABLE functions IS 'Funções organizacionais — não são agentes de IA (Domínio 01)';
COMMENT ON TABLE function_assignments IS 'Atribuição de funções organizacionais a registros de agent (Domínio 01)';
COMMENT ON TABLE roles IS 'Papéis de governança (Domínio 07)';
COMMENT ON TABLE role_permissions IS 'Matriz de permissões por papel — negação por padrão (Domínio 07)';
COMMENT ON TABLE approvals IS 'Solicitações de aprovação para ações sensíveis (Domínio 07)';
COMMENT ON TABLE secret_references IS 'Referências de segredos — não armazena valores (Domínio 07)';
COMMENT ON TABLE audit_events IS 'Eventos de auditoria de segurança (Domínio 07)';
COMMENT ON TABLE decisions IS 'Decisões tomadas por Hermes (Domínio 06)';
