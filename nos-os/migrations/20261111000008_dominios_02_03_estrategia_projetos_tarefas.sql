-- ====================================================================
-- NOS-OS — Migration Domínios 02 e 03
-- Estratégia, Objetivos, Projetos e Tarefas
-- Versão: 20261111000008
-- ====================================================================

-- ====================================================================
-- DOMÍNIO 02 — ESTRATÉGIA E OBJETIVOS
-- ====================================================================

-- Resultados-chave (Key Results) de cada objetivo
CREATE TABLE IF NOT EXISTS key_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    goal_id UUID NOT NULL REFERENCES goals(id) ON DELETE CASCADE,
    code VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    metric VARCHAR(255) NOT NULL,
    target_value NUMERIC(15, 4) NOT NULL,
    current_value NUMERIC(15, 4) NOT NULL DEFAULT 0,
    unit VARCHAR(50),
    status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'achieved', 'at_risk', 'cancelled')),
    due_date DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (company_id, code)
);

-- Métricas independentes
CREATE TABLE IF NOT EXISTS metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    code VARCHAR(50) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    unit VARCHAR(50),
    target_value NUMERIC(15, 4),
    current_value NUMERIC(15, 4) NOT NULL DEFAULT 0,
    status VARCHAR(50) NOT NULL DEFAULT 'active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (company_id, code)
);

-- Relações pai/filho entre objetivos
CREATE TABLE IF NOT EXISTS goal_relations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    parent_goal_id UUID NOT NULL REFERENCES goals(id) ON DELETE CASCADE,
    child_goal_id UUID NOT NULL REFERENCES goals(id) ON DELETE CASCADE,
    relation_type VARCHAR(50) NOT NULL DEFAULT 'decomposes' CHECK (relation_type IN ('decomposes', 'supports', 'blocks')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (parent_goal_id, child_goal_id)
);

-- Snapshots de progresso de objetivos
CREATE TABLE IF NOT EXISTS goal_progress_snapshots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    goal_id UUID NOT NULL REFERENCES goals(id) ON DELETE CASCADE,
    progress_percentage NUMERIC(5, 2) NOT NULL DEFAULT 0,
    calculated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    calculation_method VARCHAR(100) NOT NULL,
    evidence JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_by_agent_id UUID,
    UNIQUE (goal_id, calculated_at)
);

CREATE INDEX IF NOT EXISTS idx_key_results_goal ON key_results(goal_id);
CREATE INDEX IF NOT EXISTS idx_key_results_status ON key_results(status);
CREATE INDEX IF NOT EXISTS idx_metrics_company ON metrics(company_id);
CREATE INDEX IF NOT EXISTS idx_goal_relations_parent ON goal_relations(parent_goal_id);
CREATE INDEX IF NOT EXISTS idx_goal_relations_child ON goal_relations(child_goal_id);
CREATE INDEX IF NOT EXISTS idx_goal_progress_goal ON goal_progress_snapshots(goal_id);

-- ====================================================================
-- DOMÍNIO 03 — GESTÃO DE PROJETOS E TAREFAS
-- ====================================================================

-- Projetos (estender além da tabela issues existente)
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
    code VARCHAR(50) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'planning' CHECK (status IN ('planning', 'in_progress', 'on_hold', 'completed', 'cancelled')),
    priority VARCHAR(20) NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    lead_agent_id UUID REFERENCES agents(id) ON DELETE SET NULL,
    start_date DATE,
    due_date DATE,
    budget NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (company_id, code)
);

-- Membros do projeto
CREATE TABLE IF NOT EXISTS project_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    agent_id UUID REFERENCES agents(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL DEFAULT 'member',
    joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (project_id, agent_id)
);

-- Subtarefas
CREATE TABLE IF NOT EXISTS subtasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    issue_id UUID REFERENCES issues(id) ON DELETE CASCADE,
    code VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'backlog' CHECK (status IN ('backlog', 'todo', 'in_progress', 'in_review', 'done', 'blocked', 'cancelled')),
    priority VARCHAR(20) NOT NULL DEFAULT 'medium',
    assignee_agent_id UUID REFERENCES agents(id) ON DELETE SET NULL,
    due_date DATE,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (company_id, code)
);

-- Dependências entre tarefas
CREATE TABLE IF NOT EXISTS dependencies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    source_issue_id UUID REFERENCES issues(id) ON DELETE CASCADE,
    target_issue_id UUID REFERENCES issues(id) ON DELETE CASCADE,
    dependency_type VARCHAR(50) NOT NULL DEFAULT 'blocks' CHECK (dependency_type IN ('blocks', 'is_blocked_by', 'relates_to')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (source_issue_id, target_issue_id, dependency_type)
);

-- Comentários em tarefas
CREATE TABLE IF NOT EXISTS comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    issue_id UUID REFERENCES issues(id) ON DELETE CASCADE,
    author_agent_id UUID REFERENCES agents(id) ON DELETE SET NULL,
    author_user_id UUID,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Anexos em tarefas
CREATE TABLE IF NOT EXISTS attachments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    issue_id UUID REFERENCES issues(id) ON DELETE CASCADE,
    file_name VARCHAR(500) NOT NULL,
    file_url TEXT,
    file_size_bytes BIGINT,
    uploaded_by_agent_id UUID REFERENCES agents(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Entregáveis
CREATE TABLE IF NOT EXISTS deliverables (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    issue_id UUID REFERENCES issues(id) ON DELETE CASCADE,
    code VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'delivered', 'accepted', 'rejected')),
    due_date DATE,
    delivered_at TIMESTAMPTZ,
    accepted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (company_id, code)
);

-- Critérios de aceitação
CREATE TABLE IF NOT EXISTS acceptance_criteria (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    issue_id UUID REFERENCES issues(id) ON DELETE CASCADE,
    deliverable_id UUID REFERENCES deliverables(id) ON DELETE SET NULL,
    code VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    is_met BOOLEAN NOT NULL DEFAULT FALSE,
    evidence JSONB NOT NULL DEFAULT '{}'::jsonb,
    verified_by_agent_id UUID REFERENCES agents(id) ON DELETE SET NULL,
    verified_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (company_id, code)
);

-- Revisões de tarefas
CREATE TABLE IF NOT EXISTS reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    issue_id UUID REFERENCES issues(id) ON DELETE CASCADE,
    reviewer_agent_id UUID REFERENCES agents(id) ON DELETE SET NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'changes_requested')),
    comments TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Estender tabela issues existente com campos do domínio 03
ALTER TABLE issues ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE issues ADD COLUMN IF NOT EXISTS acceptance_criteria TEXT;
ALTER TABLE issues ADD COLUMN IF NOT EXISTS deliverable_id UUID REFERENCES deliverables(id) ON DELETE SET NULL;
ALTER TABLE issues ADD COLUMN IF NOT EXISTS origin_kind VARCHAR(50);

CREATE INDEX IF NOT EXISTS idx_projects_company ON projects(company_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_project_members_project ON project_members(project_id);
CREATE INDEX IF NOT EXISTS idx_subtasks_issue ON subtasks(issue_id);
CREATE INDEX IF NOT EXISTS idx_subtasks_status ON subtasks(status);
CREATE INDEX IF NOT EXISTS idx_dependencies_source ON dependencies(source_issue_id);
CREATE INDEX IF NOT EXISTS idx_dependencies_target ON dependencies(target_issue_id);
CREATE INDEX IF NOT EXISTS idx_comments_issue ON comments(issue_id);
CREATE INDEX IF NOT EXISTS idx_attachments_issue ON attachments(issue_id);
CREATE INDEX IF NOT EXISTS idx_deliverables_issue ON deliverables(issue_id);
CREATE INDEX IF NOT EXISTS idx_acceptance_criteria_issue ON acceptance_criteria(issue_id);
CREATE INDEX IF NOT EXISTS idx_reviews_issue ON reviews(issue_id);

-- Comentários
COMMENT ON TABLE key_results IS 'Resultados-chave de objetivos (Domínio 02)';
COMMENT ON TABLE metrics IS 'Métricas independentes (Domínio 02)';
COMMENT ON TABLE goal_relations IS 'Relações pai/filho entre objetivos (Domínio 02)';
COMMENT ON TABLE goal_progress_snapshots IS 'Snapshots de progresso de objetivos (Domínio 02)';
COMMENT ON TABLE projects IS 'Projetos organizacionais (Domínio 03)';
COMMENT ON TABLE project_members IS 'Membros de projetos (Domínio 03)';
COMMENT ON TABLE subtasks IS 'Subtarefas (Domínio 03)';
COMMENT ON TABLE dependencies IS 'Dependências entre tarefas (Domínio 03)';
COMMENT ON TABLE comments IS 'Comentários em tarefas (Domínio 03)';
COMMENT ON TABLE attachments IS 'Anexos em tarefas (Domínio 03)';
COMMENT ON TABLE deliverables IS 'Entregáveis (Domínio 03)';
COMMENT ON TABLE acceptance_criteria IS 'Critérios de aceitação (Domínio 03)';
COMMENT ON TABLE reviews IS 'Revisões de tarefas (Domínio 03)';
