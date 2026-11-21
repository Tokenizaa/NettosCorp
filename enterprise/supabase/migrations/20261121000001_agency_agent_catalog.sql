-- ============================================================================
-- MIGRAÇÃO: Tabelas do Catálogo Agency Agents na NettosCorp Enterprise
-- ============================================================================
-- Armazena modelos profissionais do Agency Agents (283 perfis, 18 categorias)
-- para planejamento estratégico, avaliação e seleção de equipes.
-- Não cria nem modifica agentes operacionais no Paperclip.
-- ============================================================================

CREATE TABLE IF NOT EXISTS agency_agent_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL,
    category TEXT NOT NULL,
    specialty TEXT NOT NULL,
    name TEXT NOT NULL,
    code TEXT NOT NULL,
    identity TEXT NOT NULL,
    specialty_description TEXT NOT NULL,
    competencies JSONB DEFAULT '[]'::jsonb,
    personality TEXT NOT NULL,
    responsibilities JSONB DEFAULT '[]'::jsonb,
    methodology TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'disponivel',
    homologated_at TIMESTAMP,
    homologated_by TEXT,
    homologation_notes TEXT,
    source_file TEXT NOT NULL,
    source_hash TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE (organization_id, code)
);

CREATE INDEX IF NOT EXISTS idx_agency_agent_profiles_org_id ON agency_agent_profiles(organization_id);
CREATE INDEX IF NOT EXISTS idx_agency_agent_profiles_category ON agency_agent_profiles(category);
CREATE INDEX IF NOT EXISTS idx_agency_agent_profiles_status ON agency_agent_profiles(status);
CREATE INDEX IF NOT EXISTS idx_agency_agent_profiles_code ON agency_agent_profiles(code);

CREATE TABLE IF NOT EXISTS agency_agent_selections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL,
    profile_id UUID NOT NULL REFERENCES agency_agent_profiles(id) ON DELETE CASCADE,
    profile_code TEXT,
    project_name TEXT NOT NULL,
    purpose TEXT NOT NULL,
    selected_by TEXT NOT NULL,
    selected_by_name TEXT,
    selected_at TIMESTAMP NOT NULL DEFAULT NOW(),
    status TEXT NOT NULL DEFAULT 'planejado',
    notes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_agency_agent_selections_org_id ON agency_agent_selections(organization_id);
CREATE INDEX IF NOT EXISTS idx_agency_agent_selections_profile_id ON agency_agent_selections(profile_id);
CREATE INDEX IF NOT EXISTS idx_agency_agent_selections_status ON agency_agent_selections(status);

CREATE TABLE IF NOT EXISTS agency_agent_homologations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL,
    profile_id UUID NOT NULL REFERENCES agency_agent_profiles(id) ON DELETE CASCADE,
    profile_code TEXT,
    status TEXT NOT NULL,
    reviewed_by TEXT NOT NULL,
    reviewed_by_name TEXT,
    reviewed_at TIMESTAMP NOT NULL DEFAULT NOW(),
    notes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_agency_agent_homologations_org_id ON agency_agent_homologations(organization_id);
CREATE INDEX IF NOT EXISTS idx_agency_agent_homologations_profile_id ON agency_agent_homologations(profile_id);
CREATE INDEX IF NOT EXISTS idx_agency_agent_homologations_status ON agency_agent_homologations(status);

-- ============================================================================
-- COMO APLICAR:
-- SQL Editor do Supabase: colar e executar
-- Projeto: udeglcdloehagljrrukj
-- ============================================================================
