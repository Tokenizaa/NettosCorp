-- ====================================================================
-- NOS-OS — Migration Domínios 04 e 05
-- Orquestração, Coordenação e Motor de Execução
-- Versão: 20261111000009
-- ====================================================================

-- ====================================================================
-- DOMÍNIO 04 — ORQUESTRAÇÃO E COORDENAÇÃO
-- ====================================================================

-- Filas de trabalho persistentes
CREATE TABLE IF NOT EXISTS work_queues (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    code VARCHAR(50) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'closed')),
    concurrency_limit INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (company_id, code)
);

-- Itens da fila de trabalho
CREATE TABLE IF NOT EXISTS work_queue_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    queue_id UUID NOT NULL REFERENCES work_queues(id) ON DELETE CASCADE,
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    issue_id UUID REFERENCES issues(id) ON DELETE SET NULL,
    function_agent_id UUID REFERENCES agents(id) ON DELETE SET NULL,
    claimed_by_agent_id UUID REFERENCES agents(id) ON DELETE SET NULL,
    claimed_at TIMESTAMPTZ,
    lease_expires_at TIMESTAMPTZ,
    status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'claimed', 'in_progress', 'completed', 'failed', 'released', 'cancelled')),
    priority INTEGER NOT NULL DEFAULT 0,
    retry_count INTEGER NOT NULL DEFAULT 0,
    max_retries INTEGER NOT NULL DEFAULT 3,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Agendamento
CREATE TABLE IF NOT EXISTS schedules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    code VARCHAR(50) NOT NULL,
    name VARCHAR(255) NOT NULL,
    cron_expression VARCHAR(100) NOT NULL,
    timezone VARCHAR(50) NOT NULL DEFAULT 'America/Sao_Paulo',
    queue_id UUID REFERENCES work_queues(id) ON DELETE SET NULL,
    issue_template_id UUID,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    last_run_at TIMESTAMPTZ,
    next_run_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (company_id, code)
);

-- Gatilhos
CREATE TABLE IF NOT EXISTS triggers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    code VARCHAR(50) NOT NULL,
    name VARCHAR(255) NOT NULL,
    trigger_type VARCHAR(50) NOT NULL CHECK (trigger_type IN ('schedule', 'event', 'task_assigned', 'approval', 'recoverable_failure', 'explicit_request')),
    event_name VARCHAR(255),
    queue_id UUID REFERENCES work_queues(id) ON DELETE SET NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    last_fired_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (company_id, code)
);

-- Execuções de orquestração
CREATE TABLE IF NOT EXISTS orchestration_runs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    trigger_id UUID REFERENCES triggers(id) ON DELETE SET NULL,
    queue_id UUID REFERENCES work_queues(id) ON DELETE SET NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'running' CHECK (status IN ('running', 'completed', 'failed', 'cancelled')),
    started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    items_processed INTEGER NOT NULL DEFAULT 0,
    items_succeeded INTEGER NOT NULL DEFAULT 0,
    items_failed INTEGER NOT NULL DEFAULT 0,
    error_details JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Estado de dependências
CREATE TABLE IF NOT EXISTS dependency_states (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    issue_id UUID NOT NULL REFERENCES issues(id) ON DELETE CASCADE,
    dependency_issue_id UUID NOT NULL REFERENCES issues(id) ON DELETE CASCADE,
    status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'satisfied', 'failed', 'blocked')),
    checked_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (issue_id, dependency_issue_id)
);

-- Políticas de retry
CREATE TABLE IF NOT EXISTS retry_policies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    code VARCHAR(50) NOT NULL,
    name VARCHAR(255) NOT NULL,
    max_attempts INTEGER NOT NULL DEFAULT 3,
    base_delay_seconds INTEGER NOT NULL DEFAULT 60,
    max_delay_seconds INTEGER NOT NULL DEFAULT 3600,
    backoff_multiplier NUMERIC(5, 2) NOT NULL DEFAULT 2.0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (company_id, code)
);

CREATE INDEX IF NOT EXISTS idx_work_queues_company ON work_queues(company_id);
CREATE INDEX IF NOT EXISTS idx_work_queue_items_queue ON work_queue_items(queue_id);
CREATE INDEX IF NOT EXISTS idx_work_queue_items_status ON work_queue_items(status);
CREATE INDEX IF NOT EXISTS idx_work_queue_items_claimed ON work_queue_items(claimed_by_agent_id);
CREATE INDEX IF NOT EXISTS idx_work_queue_items_lease ON work_queue_items(lease_expires_at);
CREATE INDEX IF NOT EXISTS idx_schedules_company ON schedules(company_id);
CREATE INDEX IF NOT EXISTS idx_triggers_company ON triggers(company_id);
CREATE INDEX IF NOT EXISTS idx_orchestration_runs_company ON orchestration_runs(company_id);
CREATE INDEX IF NOT EXISTS idx_orchestration_runs_status ON orchestration_runs(status);
CREATE INDEX IF NOT EXISTS idx_dependency_states_issue ON dependency_states(issue_id);
CREATE INDEX IF NOT EXISTS idx_retry_policies_company ON retry_policies(company_id);

-- ====================================================================
-- DOMÍNIO 05 — MOTOR DE EXECUÇÃO
-- ====================================================================

-- Sessões de execução
CREATE TABLE IF NOT EXISTS sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    execution_id UUID,
    actor VARCHAR(100) NOT NULL DEFAULT 'hermes',
    trigger_source VARCHAR(100) NOT NULL,
    task_or_goal_id UUID,
    status VARCHAR(50) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'failed', 'cancelled')),
    started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    next_action TEXT,
    context JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Execuções individuais
CREATE TABLE IF NOT EXISTS executions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    session_id UUID REFERENCES sessions(id) ON DELETE SET NULL,
    execution_id VARCHAR(100) NOT NULL,
    actor VARCHAR(100) NOT NULL DEFAULT 'hermes',
    origin_trigger VARCHAR(100),
    task_or_goal_id UUID,
    status VARCHAR(50) NOT NULL DEFAULT 'started' CHECK (status IN ('started', 'in_progress', 'completed', 'failed', 'cancelled')),
    started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    result_summary TEXT,
    errors TEXT,
    artifacts JSONB NOT NULL DEFAULT '[]'::jsonb,
    costs JSONB NOT NULL DEFAULT '{}'::jsonb,
    next_action TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Passos de execução
CREATE TABLE IF NOT EXISTS execution_steps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    execution_id UUID NOT NULL REFERENCES executions(id) ON DELETE CASCADE,
    step_number INTEGER NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'failed', 'skipped')),
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    result TEXT,
    error TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Invocações de ferramentas
CREATE TABLE IF NOT EXISTS tool_invocations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    execution_step_id UUID REFERENCES execution_steps(id) ON DELETE SET NULL,
    execution_id UUID REFERENCES executions(id) ON DELETE CASCADE,
    tool_name VARCHAR(255) NOT NULL,
    parameters_safe JSONB NOT NULL DEFAULT '{}'::jsonb,
    authorization_checked BOOLEAN NOT NULL DEFAULT FALSE,
    started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    result TEXT,
    error TEXT,
    duration_ms INTEGER,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Artefatos de execução
CREATE TABLE IF NOT EXISTS execution_artifacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    execution_id UUID NOT NULL REFERENCES executions(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(100) NOT NULL,
    content_url TEXT,
    content_hash VARCHAR(64),
    size_bytes INTEGER,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Pontos de verificação (checkpoints)
CREATE TABLE IF NOT EXISTS checkpoints (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    execution_id UUID NOT NULL REFERENCES executions(id) ON DELETE CASCADE,
    checkpoint_name VARCHAR(255) NOT NULL,
    state_json JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Custos de execução
CREATE TABLE IF NOT EXISTS execution_costs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    execution_id UUID NOT NULL REFERENCES executions(id) ON DELETE CASCADE,
    tool_name VARCHAR(255),
    cost_type VARCHAR(50) NOT NULL DEFAULT 'compute',
    amount NUMERIC(15, 6) NOT NULL DEFAULT 0,
    currency VARCHAR(10) NOT NULL DEFAULT 'BRL',
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sessions_execution ON sessions(execution_id);
CREATE INDEX IF NOT EXISTS idx_sessions_status ON sessions(status);
CREATE INDEX IF NOT EXISTS idx_executions_company ON executions(company_id);
CREATE INDEX IF NOT EXISTS idx_executions_session ON executions(session_id);
CREATE INDEX IF NOT EXISTS idx_executions_status ON executions(status);
CREATE INDEX IF NOT EXISTS idx_executions_execution_id ON executions(execution_id);
CREATE INDEX IF NOT EXISTS idx_execution_steps_execution ON execution_steps(execution_id);
CREATE INDEX IF NOT EXISTS idx_tool_invocations_execution ON tool_invocations(execution_id);
CREATE INDEX IF NOT EXISTS idx_execution_artifacts_execution ON execution_artifacts(execution_id);
CREATE INDEX IF NOT EXISTS idx_checkpoints_execution ON checkpoints(execution_id);
CREATE INDEX IF NOT EXISTS idx_execution_costs_execution ON execution_costs(execution_id);

-- Comentários
COMMENT ON TABLE work_queues IS 'Filas de trabalho persistentes (Domínio 04)';
COMMENT ON TABLE work_queue_items IS 'Itens da fila com claim atômico (Domínio 04)';
COMMENT ON TABLE schedules IS 'Agendamento de execuções (Domínio 04)';
COMMENT ON TABLE triggers IS 'Gatilhos de execução (Domínio 04)';
COMMENT ON TABLE orchestration_runs IS 'Execuções de orquestração (Domínio 04)';
COMMENT ON TABLE dependency_states IS 'Estado de dependências entre tarefas (Domínio 04)';
COMMENT ON TABLE retry_policies IS 'Políticas de retry e recuperação (Domínio 04)';
COMMENT ON TABLE sessions IS 'Sessões de execução (Domínio 05)';
COMMENT ON TABLE executions IS 'Execuções individuais do motor (Domínio 05)';
COMMENT ON TABLE execution_steps IS 'Passos de execução (Domínio 05)';
COMMENT ON TABLE tool_invocations IS 'Invocações de ferramentas com auditoria (Domínio 05)';
COMMENT ON TABLE execution_artifacts IS 'Artefatos de execução (Domínio 05)';
COMMENT ON TABLE checkpoints IS 'Pontos de verificação para retomada (Domínio 05)';
COMMENT ON TABLE execution_costs IS 'Custos de execução (Domínio 05)';
