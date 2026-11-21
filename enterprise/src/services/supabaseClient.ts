/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import {
  UserProfile,
  Organization,
  Department,
  Position,
  AIAgent,
  Project,
  Task,
  Decision,
  Deliberation,
  GovernanceDocument,
  AuditLog,
  UserRole,
  AgencyAgentProfile,
  AgencyAgentSelection,
  AgencyAgentHomologation,
} from '../types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isLiveSupabaseConfigured = Boolean(
  SUPABASE_URL &&
  SUPABASE_ANON_KEY &&
  !SUPABASE_URL.includes('your-project') &&
  !SUPABASE_ANON_KEY.includes('your-anon')
);

export const supabase: SupabaseClient | null = isLiveSupabaseConfigured
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : null;

// =====================================================================
// PERSISTENT REPOSITORY LAYER (Supabase Mirror & Local Engine)
// Guarantees zero-dead-click functionality and role testing
// =====================================================================

const STORAGE_KEY = 'nettoscorp_enterprise_data_v1';
const SESSION_KEY = 'nettoscorp_enterprise_session_v1';

interface StorageSchema {
  organizations: Organization[];
  profiles: UserProfile[];
  departments: Department[];
  positions: Position[];
  agents: AIAgent[];
  agencyAgentProfiles: AgencyAgentProfile[];
  agencyAgentSelections: AgencyAgentSelection[];
  agencyAgentHomologations: AgencyAgentHomologation[];
  projects: Project[];
  tasks: Task[];
  decisions: Decision[];
  deliberations: Deliberation[];
  documents: GovernanceDocument[];
  auditLogs: AuditLog[];
}

const DEFAULT_ORG_ID = 'd3c6760f-f734-4154-837e-34898849f040';

const INITIAL_DATA: StorageSchema = {
  organizations: [
    {
      id: DEFAULT_ORG_ID,
      name: 'NettosCorp Enterprise S.A.',
      slug: 'nettoscorp-enterprise',
      domain: 'nettoscorp.com',
      status: 'active',
      created_at: '2026-01-10T08:00:00Z',
      updated_at: '2026-01-10T08:00:00Z',
    },
  ],
  profiles: [
    {
      id: 'usr-001',
      email: 'admin@nettoscorp.com',
      full_name: 'Dr. Orlando Netto',
      avatar_url: '',
      role: 'super_admin',
      organization_id: DEFAULT_ORG_ID,
      department_id: 'dept-001',
      position_id: 'pos-001',
      status: 'active',
      created_at: '2026-01-10T08:00:00Z',
      updated_at: '2026-01-10T08:00:00Z',
    },
    {
      id: 'usr-002',
      email: 'diretoria@nettoscorp.com',
      full_name: 'Helena Valença',
      avatar_url: '',
      role: 'director',
      organization_id: DEFAULT_ORG_ID,
      department_id: 'dept-002',
      position_id: 'pos-002',
      status: 'active',
      created_at: '2026-01-15T09:30:00Z',
      updated_at: '2026-01-15T09:30:00Z',
    },
    {
      id: 'usr-003',
      email: 'gerencia@nettoscorp.com',
      full_name: 'Marcus Bastos',
      avatar_url: '',
      role: 'manager',
      organization_id: DEFAULT_ORG_ID,
      department_id: 'dept-001',
      position_id: 'pos-003',
      status: 'active',
      created_at: '2026-01-20T10:00:00Z',
      updated_at: '2026-01-20T10:00:00Z',
    },
    {
      id: 'usr-004',
      email: 'membro@nettoscorp.com',
      full_name: 'Beatriz Lima',
      avatar_url: '',
      role: 'member',
      organization_id: DEFAULT_ORG_ID,
      department_id: 'dept-001',
      position_id: 'pos-004',
      status: 'active',
      created_at: '2026-02-01T11:00:00Z',
      updated_at: '2026-02-01T11:00:00Z',
    },
    {
      id: 'usr-005',
      email: 'auditor@nettoscorp.com',
      full_name: 'Gabriel Siqueira',
      avatar_url: '',
      role: 'viewer',
      organization_id: DEFAULT_ORG_ID,
      department_id: 'dept-003',
      position_id: 'pos-005',
      status: 'active',
      created_at: '2026-02-10T14:00:00Z',
      updated_at: '2026-02-10T14:00:00Z',
    },
  ],
  departments: [
    {
      id: 'dept-001',
      organization_id: DEFAULT_ORG_ID,
      code: 'DEP-TEC',
      name: 'Tecnologia & Inteligência Artificial',
      description: 'Engenharia de software, modelos autônomos, infraestrutura cloud e cibersegurança.',
      manager_id: 'usr-001',
      manager_name: 'Dr. Orlando Netto',
      status: 'active',
      headcount: 14,
      created_at: '2026-01-10T08:00:00Z',
      updated_at: '2026-01-10T08:00:00Z',
    },
    {
      id: 'dept-002',
      organization_id: DEFAULT_ORG_ID,
      code: 'DEP-GOV',
      name: 'Governança Corporativa & Conselho',
      description: 'Deliberações CNS, registro DEC, compliance regulatório e auditoria estatutária.',
      manager_id: 'usr-002',
      manager_name: 'Helena Valença',
      status: 'active',
      headcount: 6,
      created_at: '2026-01-10T08:00:00Z',
      updated_at: '2026-01-10T08:00:00Z',
    },
    {
      id: 'dept-003',
      organization_id: DEFAULT_ORG_ID,
      code: 'DEP-AUD',
      name: 'Auditoria & Riscos Operacionais',
      description: 'Supervisão de conformidade, trilha de auditoria digital e controles internos.',
      manager_id: 'usr-005',
      manager_name: 'Gabriel Siqueira',
      status: 'active',
      headcount: 5,
      created_at: '2026-01-15T09:00:00Z',
      updated_at: '2026-01-15T09:00:00Z',
    },
    {
      id: 'dept-004',
      organization_id: DEFAULT_ORG_ID,
      code: 'DEP-OPE',
      name: 'Operações Estratégicas',
      description: 'Gestão de processos produtivos, alocação de recursos e eficiência corporativa.',
      manager_id: 'usr-003',
      manager_name: 'Marcus Bastos',
      status: 'active',
      headcount: 18,
      created_at: '2026-01-20T10:00:00Z',
      updated_at: '2026-01-20T10:00:00Z',
    },
  ],
  positions: [
    {
      id: 'pos-001',
      organization_id: DEFAULT_ORG_ID,
      department_id: 'dept-001',
      department_name: 'Tecnologia & Inteligência Artificial',
      title: 'Chief Technology Officer (CTO)',
      code: 'POS-CTO-01',
      level: 'C-Level',
      description: 'Liderança técnica e direcionamento de arquiteturas e agentes corporativos.',
      created_at: '2026-01-10T08:00:00Z',
      updated_at: '2026-01-10T08:00:00Z',
    },
    {
      id: 'pos-002',
      organization_id: DEFAULT_ORG_ID,
      department_id: 'dept-002',
      department_name: 'Governança Corporativa & Conselho',
      title: 'Diretora de Governança e Relações Institucionais',
      code: 'POS-DIR-GOV',
      level: 'Diretoria',
      description: 'Supervisão do Conselho Consultivo, deliberações CNS e atos estatutários.',
      created_at: '2026-01-10T08:00:00Z',
      updated_at: '2026-01-10T08:00:00Z',
    },
    {
      id: 'pos-003',
      organization_id: DEFAULT_ORG_ID,
      department_id: 'dept-001',
      department_name: 'Tecnologia & Inteligência Artificial',
      title: 'Gerente de Engenharia e Operações',
      code: 'POS-GER-ENG',
      level: 'Gerência',
      description: 'Coordenação operacional de times de produto e pipelines de IA.',
      created_at: '2026-01-15T09:00:00Z',
      updated_at: '2026-01-15T09:00:00Z',
    },
    {
      id: 'pos-004',
      organization_id: DEFAULT_ORG_ID,
      department_id: 'dept-001',
      department_name: 'Tecnologia & Inteligência Artificial',
      title: 'Engenheira de Sistemas Sênior',
      code: 'POS-ENG-SR',
      level: 'Especialista',
      description: 'Desenvolvimento e sustentação de microarquiteturas e contratos de API.',
      created_at: '2026-01-20T10:00:00Z',
      updated_at: '2026-01-20T10:00:00Z',
    },
    {
      id: 'pos-005',
      organization_id: DEFAULT_ORG_ID,
      department_id: 'dept-003',
      department_name: 'Auditoria & Riscos Operacionais',
      title: 'Analista de Compliance e Auditoria',
      code: 'POS-ANA-AUD',
      level: 'Operacional',
      description: 'Aferição de conformidade e verificação contínua da trilha de eventos.',
      created_at: '2026-02-01T11:00:00Z',
      updated_at: '2026-02-01T11:00:00Z',
    },
  ],
  agents: [
    {
      id: 'agt-001',
      organization_id: DEFAULT_ORG_ID,
      code: 'AGT-GOV-01',
      name: 'NettosGov Sentinel',
      model: 'gemini-2.5-pro',
      purpose: 'Auditoria automatizada de deliberações CNS e verificação de compliance com estatuto corporativo.',
      status: 'active',
      version: '2.1.0',
      assigned_department_id: 'dept-002',
      department_name: 'Governança Corporativa & Conselho',
      config: {
        temperature: 0.2,
        max_tokens: 4096,
        system_prompt: 'Agente especializado em auditoria de decisões executivas e confrontação com normas institucionais.',
        capabilities: ['análise documental', 'validação de quórum', 'cruzamento DEC-CNS'] as string[],
      },
      created_at: '2026-01-12T10:00:00Z',
      updated_at: '2026-01-12T10:00:00Z',
    },
    {
      id: 'agt-002',
      organization_id: DEFAULT_ORG_ID,
      code: 'AGT-OPS-02',
      name: 'NettosTask Dispatcher',
      model: 'gemini-2.5-flash',
      purpose: 'Triagem, categorização e distribuição de tarefas em projetos com base em cronogramas.',
      status: 'active',
      version: '1.4.2',
      assigned_department_id: 'dept-001',
      department_name: 'Tecnologia & Inteligência Artificial',
      config: {
        temperature: 0.1,
        max_tokens: 2048,
        system_prompt: 'Despacho automatizado e sincronização de atividades.',
        capabilities: ['priorização de sprints', 'estimativa de esforço', 'alocação de recursos'] as string[],
      },
      created_at: '2026-01-18T14:30:00Z',
      updated_at: '2026-01-18T14:30:00Z',
    },
    {
      id: 'agt-003',
      organization_id: DEFAULT_ORG_ID,
      code: 'AGT-DOC-03',
      name: 'Paperclip Bridge Agent',
      model: 'gemini-2.5-flash',
      purpose: 'Interface de verificação de schemas e contratos documentais com o repositório Paperclip.',
      status: 'standby',
      version: '0.9.0',
      assigned_department_id: 'dept-002',
      department_name: 'Governança Corporativa & Conselho',
      config: {
        temperature: 0.0,
        max_tokens: 1024,
        system_prompt: 'Validador formal de schemas de integração Paperclip sem modificação externa.',
        capabilities: ['validação de integridade', 'checagem de hash', 'auditoria de contratos'] as string[],
      },
      created_at: '2026-02-05T09:00:00Z',
      updated_at: '2026-02-05T09:00:00Z',
    },
  ],
  agencyAgentProfiles: [] as AgencyAgentProfile[],
  agencyAgentSelections: [] as AgencyAgentSelection[],
  agencyAgentHomologations: [] as AgencyAgentHomologation[],
  projects: [
    {
      id: 'prj-001',
      organization_id: DEFAULT_ORG_ID,
      department_id: 'dept-001',
      department_name: 'Tecnologia & Inteligência Artificial',
      code: 'PRJ-2026-ENT',
      name: 'Plataforma Corporativa Integrada',
      description: 'Implantação do ecossistema central de governança, agentes autônomos e trilha de auditoria RLS.',
      status: 'in_progress',
      priority: 'urgent',
      lead_id: 'usr-001',
      lead_name: 'Dr. Orlando Netto',
      start_date: '2026-01-15',
      due_date: '2026-06-30',
      budget: 450000.00,
      created_at: '2026-01-15T09:00:00Z',
      updated_at: '2026-01-15T09:00:00Z',
    },
    {
      id: 'prj-002',
      organization_id: DEFAULT_ORG_ID,
      department_id: 'dept-002',
      department_name: 'Governança Corporativa & Conselho',
      code: 'PRJ-2026-GOV',
      name: 'Consolidação Regimental DEC/CNS',
      description: 'Padronização dos ritos deliberativos e registro unificado de decisões do conselho consultivo.',
      status: 'in_progress',
      priority: 'high',
      lead_id: 'usr-002',
      lead_name: 'Helena Valença',
      start_date: '2026-02-01',
      due_date: '2026-04-15',
      budget: 120000.00,
      created_at: '2026-02-01T08:00:00Z',
      updated_at: '2026-02-01T08:00:00Z',
    },
    {
      id: 'prj-003',
      organization_id: DEFAULT_ORG_ID,
      department_id: 'dept-003',
      department_name: 'Auditoria & Riscos Operacionais',
      code: 'PRJ-2026-AUD',
      name: 'Auditoria Contínua & Segurança RLS',
      description: 'Validação estatutária de isolamento de tenants, integridade de logs e conformidade LGPD/ISO 27001.',
      status: 'planning',
      priority: 'medium',
      lead_id: 'usr-005',
      lead_name: 'Gabriel Siqueira',
      start_date: '2026-03-01',
      due_date: '2026-08-30',
      budget: 95000.00,
      created_at: '2026-02-10T11:00:00Z',
      updated_at: '2026-02-10T11:00:00Z',
    },
  ],
  tasks: [
    {
      id: 'tsk-001',
      organization_id: DEFAULT_ORG_ID,
      project_id: 'prj-001',
      project_name: 'Plataforma Corporativa Integrada',
      code: 'TSK-101',
      title: 'Implementação de Políticas RLS no Supabase',
      description: 'Criar e auditar políticas de Row Level Security para todos os papéis corporativos.',
      status: 'done',
      priority: 'urgent',
      assignee_id: 'usr-001',
      assignee_name: 'Dr. Orlando Netto',
      assignee_type: 'user',
      reporter_id: 'usr-001',
      reporter_name: 'Dr. Orlando Netto',
      due_date: '2026-02-28',
      completed_at: '2026-02-25T16:00:00Z',
      created_at: '2026-01-20T08:00:00Z',
      updated_at: '2026-02-25T16:00:00Z',
    },
    {
      id: 'tsk-002',
      organization_id: DEFAULT_ORG_ID,
      project_id: 'prj-001',
      project_name: 'Plataforma Corporativa Integrada',
      code: 'TSK-102',
      title: 'Estruturação do Barramento de Agentes IA',
      description: 'Conectar agente NettosGov Sentinel aos pipelines de validação de documentos.',
      status: 'in_progress',
      priority: 'high',
      assignee_id: 'agt-001',
      assignee_name: 'NettosGov Sentinel',
      assignee_type: 'agent',
      reporter_id: 'usr-003',
      reporter_name: 'Marcus Bastos',
      due_date: '2026-03-15',
      created_at: '2026-02-05T09:00:00Z',
      updated_at: '2026-02-05T09:00:00Z',
    },
    {
      id: 'tsk-003',
      organization_id: DEFAULT_ORG_ID,
      project_id: 'prj-002',
      project_name: 'Consolidação Regimental DEC/CNS',
      code: 'TSK-201',
      title: 'Registro e Indexação das Deliberações do 1º Trimestre',
      description: 'Digitalizar e referenciar as atas CNS-2026 com os respectivos Decretos Institucionais.',
      status: 'in_progress',
      priority: 'high',
      assignee_id: 'usr-002',
      assignee_name: 'Helena Valença',
      assignee_type: 'user',
      reporter_id: 'usr-002',
      reporter_name: 'Helena Valença',
      due_date: '2026-03-20',
      created_at: '2026-02-12T14:00:00Z',
      updated_at: '2026-02-12T14:00:00Z',
    },
    {
      id: 'tsk-004',
      organization_id: DEFAULT_ORG_ID,
      project_id: 'prj-001',
      project_name: 'Plataforma Corporativa Integrada',
      code: 'TSK-103',
      title: 'Auditoria de Desempenho e Índices PostgreSQL',
      description: 'Verificar tempo de resposta em planos de execução com filtros multi-tenant.',
      status: 'todo',
      priority: 'medium',
      assignee_id: 'usr-004',
      assignee_name: 'Beatriz Lima',
      assignee_type: 'user',
      reporter_id: 'usr-003',
      reporter_name: 'Marcus Bastos',
      due_date: '2026-03-30',
      created_at: '2026-02-15T11:00:00Z',
      updated_at: '2026-02-15T11:00:00Z',
    },
    {
      id: 'tsk-005',
      organization_id: DEFAULT_ORG_ID,
      project_id: 'prj-003',
      project_name: 'Auditoria Contínua & Segurança RLS',
      code: 'TSK-301',
      title: 'Revisão da Trilha de Eventos e Auditoria Automatizada',
      description: 'Confrontar logs de autenticação e mutação com matriz de segregação de funções.',
      status: 'todo',
      priority: 'medium',
      assignee_id: 'usr-005',
      assignee_name: 'Gabriel Siqueira',
      assignee_type: 'user',
      reporter_id: 'usr-002',
      reporter_name: 'Helena Valença',
      due_date: '2026-04-10',
      created_at: '2026-02-20T15:00:00Z',
      updated_at: '2026-02-20T15:00:00Z',
    },
  ],
  decisions: [
    {
      id: 'dec-001',
      organization_id: DEFAULT_ORG_ID,
      dec_code: 'DEC-2026-001',
      title: 'Aprovação da Arquitetura de Governança Digital e Multi-Tenancy',
      summary: 'Determina a obrigatoriedade de isolamento de dados via RLS e auditoria imutável em todas as divisões corporativas.',
      rationale: 'Adequação aos padrões internacionais de governança, rastreabilidade de decisões e soberania de dados.',
      status: 'in_effect',
      decided_by: 'Conselho Consultivo NettosCorp',
      decided_by_name: 'Conselho Consultivo',
      decided_at: '2026-01-18',
      deliberation_ref_id: 'cns-001',
      deliberation_cns_code: 'CNS-2026-001',
      created_at: '2026-01-18T16:00:00Z',
      updated_at: '2026-01-18T16:00:00Z',
    },
    {
      id: 'dec-002',
      organization_id: DEFAULT_ORG_ID,
      dec_code: 'DEC-2026-002',
      title: 'Instituição do Programa de Agentes Autônomos Supervisionados',
      summary: 'Normatiza o ciclo de vida, permissões de escrita e limites operacionais para agentes de Inteligência Artificial.',
      rationale: 'Garantir que nenhum agente autônomo possua autorização desacompanhada de revisão humana qualificada.',
      status: 'in_effect',
      decided_by: 'Diretoria Executiva',
      decided_by_name: 'Diretoria Executiva',
      decided_at: '2026-02-05',
      deliberation_ref_id: 'cns-002',
      deliberation_cns_code: 'CNS-2026-002',
      created_at: '2026-02-05T14:30:00Z',
      updated_at: '2026-02-05T14:30:00Z',
    },
    {
      id: 'dec-003',
      organization_id: DEFAULT_ORG_ID,
      dec_code: 'DEC-2026-003',
      title: 'Homologação do Contrato de Integração Paperclip',
      summary: 'Aprova o protocolo de interoperabilidade de metadados com o repositório documental sem alteração de arquivos de origem.',
      rationale: 'Preservação da cadeia de custódia e integridade de registros institucionais.',
      status: 'ratified',
      decided_by: 'Comitê de Tecnologia e Compliance',
      decided_by_name: 'Comitê de Tecnologia',
      decided_at: '2026-02-22',
      deliberation_ref_id: 'cns-003',
      deliberation_cns_code: 'CNS-2026-003',
      created_at: '2026-02-22T10:00:00Z',
      updated_at: '2026-02-22T10:00:00Z',
    },
  ],
  deliberations: [
    {
      id: 'cns-001',
      organization_id: DEFAULT_ORG_ID,
      cns_code: 'CNS-2026-001',
      title: '1ª Sessão Ordinária: Diretrizes Estruturais de Governança e Tecnologia',
      session_date: '2026-01-18',
      president: 'Dr. Orlando Netto',
      quorum: '5/5 Conselheiros Titulares (Quórum Integral)',
      decision_summary: 'Aprovada por unanimidade a implantação da plataforma com autorização em nível de banco de dados (RLS).',
      status: 'approved',
      dec_ref_id: 'dec-001',
      dec_code_ref: 'DEC-2026-001',
      delib_file_ref: 'DELIB-2026-001',
      created_at: '2026-01-18T18:00:00Z',
      updated_at: '2026-01-18T18:00:00Z',
    },
    {
      id: 'cns-002',
      organization_id: DEFAULT_ORG_ID,
      cns_code: 'CNS-2026-002',
      title: '2ª Sessão Extraordinária: Marco Regulatório para Agentes de IA',
      session_date: '2026-02-05',
      president: 'Helena Valença',
      quorum: '4/5 Conselheiros Titulares',
      decision_summary: 'Regulamentadas as diretrizes operacionais de agentes autônomos e papéis com privilégio elevado.',
      status: 'approved',
      dec_ref_id: 'dec-002',
      dec_code_ref: 'DEC-2026-002',
      delib_file_ref: 'DELIB-2026-002',
      created_at: '2026-02-05T16:00:00Z',
      updated_at: '2026-02-05T16:00:00Z',
    },
    {
      id: 'cns-003',
      organization_id: DEFAULT_ORG_ID,
      cns_code: 'CNS-2026-003',
      title: '3ª Sessão Ordinária: Alinhamento de Contratos de Interoperabilidade',
      session_date: '2026-02-22',
      president: 'Dr. Orlando Netto',
      quorum: '5/5 Conselheiros Titulares',
      decision_summary: 'Ratificação formal do barramento de comunicação e auditoria com sistemas parceiros e Paperclip.',
      status: 'approved',
      dec_ref_id: 'dec-003',
      dec_code_ref: 'DEC-2026-003',
      delib_file_ref: 'DELIB-2026-003',
      created_at: '2026-02-22T12:00:00Z',
      updated_at: '2026-02-22T12:00:00Z',
    },
  ],
  documents: [
    {
      id: 'doc-001',
      organization_id: DEFAULT_ORG_ID,
      doc_type: 'DELIB',
      doc_code: 'DELIB-2026-001',
      title: 'Ata Integral da 1ª Sessão Ordinária do Conselho Consultivo',
      version: '1.0',
      status: 'published',
      file_url: '/documents/DELIB-2026-001.pdf',
      file_size_bytes: 482910,
      cns_ref: 'CNS-2026-001',
      dec_ref: 'DEC-2026-001',
      delib_ref: 'DELIB-2026-001',
      author_id: 'usr-002',
      author_name: 'Helena Valença',
      metadata: { classification: 'Estatutário', quorum_verified: true },
      created_at: '2026-01-18T19:00:00Z',
      updated_at: '2026-01-18T19:00:00Z',
    },
    {
      id: 'doc-002',
      organization_id: DEFAULT_ORG_ID,
      doc_type: 'DELIB',
      doc_code: 'DELIB-2026-002',
      title: 'Ata Integral da 2ª Sessão Extraordinária: Marco de IA',
      version: '1.0',
      status: 'published',
      file_url: '/documents/DELIB-2026-002.pdf',
      file_size_bytes: 395120,
      cns_ref: 'CNS-2026-002',
      dec_ref: 'DEC-2026-002',
      delib_ref: 'DELIB-2026-002',
      author_id: 'usr-002',
      author_name: 'Helena Valença',
      metadata: { classification: 'Operacional / Regulatória' },
      created_at: '2026-02-05T17:00:00Z',
      updated_at: '2026-02-05T17:00:00Z',
    },
    {
      id: 'doc-003',
      organization_id: DEFAULT_ORG_ID,
      doc_type: 'DEC',
      doc_code: 'DEC-DOC-2026-001',
      title: 'Instrumento Normativo de Governança Corporativa e RLS',
      version: '1.1',
      status: 'published',
      file_url: '/documents/DEC-2026-001-INSTR.pdf',
      file_size_bytes: 620400,
      cns_ref: 'CNS-2026-001',
      dec_ref: 'DEC-2026-001',
      delib_ref: 'DELIB-2026-001',
      author_id: 'usr-001',
      author_name: 'Dr. Orlando Netto',
      metadata: { legal_binding: true },
      created_at: '2026-01-19T10:00:00Z',
      updated_at: '2026-01-19T10:00:00Z',
    },
    {
      id: 'doc-004',
      organization_id: DEFAULT_ORG_ID,
      doc_type: 'POLICY',
      doc_code: 'POL-SEC-2026',
      title: 'Política Institucional de Segurança da Informação e Segregação de Funções',
      version: '2.0',
      status: 'published',
      file_url: '/documents/POL-SEC-2026.pdf',
      file_size_bytes: 840000,
      author_id: 'usr-001',
      author_name: 'Dr. Orlando Netto',
      metadata: { compliance: ['ISO27001', 'LGPD', 'SOC2'] },
      created_at: '2026-01-10T08:00:00Z',
      updated_at: '2026-01-10T08:00:00Z',
    },
  ],
  auditLogs: [
    {
      id: 'aud-001',
      organization_id: DEFAULT_ORG_ID,
      user_id: 'usr-001',
      user_email: 'admin@nettoscorp.com',
      action: 'LOGIN',
      resource: 'auth',
      resource_id: 'usr-001',
      details: { client: 'Enterprise AppShell', method: 'password' },
      ip_address: '10.0.4.12',
      created_at: '2026-02-26T08:00:00Z',
    },
    {
      id: 'aud-002',
      organization_id: DEFAULT_ORG_ID,
      user_id: 'usr-001',
      user_email: 'admin@nettoscorp.com',
      action: 'CREATE',
      resource: 'decisions',
      resource_id: 'dec-001',
      details: { dec_code: 'DEC-2026-001', title: 'Aprovação da Arquitetura de Governança' },
      ip_address: '10.0.4.12',
      created_at: '2026-02-26T08:15:00Z',
    },
    {
      id: 'aud-003',
      organization_id: DEFAULT_ORG_ID,
      user_id: 'usr-002',
      user_email: 'diretoria@nettoscorp.com',
      action: 'CREATE',
      resource: 'deliberations',
      resource_id: 'cns-001',
      details: { cns_code: 'CNS-2026-001', session_date: '2026-01-18' },
      ip_address: '10.0.4.19',
      created_at: '2026-02-26T09:00:00Z',
    },
    {
      id: 'aud-004',
      organization_id: DEFAULT_ORG_ID,
      user_id: 'usr-003',
      user_email: 'gerencia@nettoscorp.com',
      action: 'STATUS_CHANGE',
      resource: 'tasks',
      resource_id: 'tsk-001',
      details: { task_code: 'TSK-101', previous: 'in_progress', next: 'done' },
      ip_address: '10.0.4.30',
      created_at: '2026-02-26T10:30:00Z',
    },
  ],
};

class LocalSupabaseStore {
  private data: StorageSchema;
  private currentSession: UserProfile | null = null;
  private listeners: Array<() => void> = [];

  constructor() {
    this.data = this.loadData();
    this.currentSession = this.loadSession();
  }

  private loadData(): StorageSchema {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Faz merge com INITIAL_DATA para garantir que propriedades novas existam
        return { ...INITIAL_DATA, ...parsed };
      }
    } catch {
      // ignore
    }
    this.saveData(INITIAL_DATA);
    return INITIAL_DATA;
  }

  private saveData(data: StorageSchema): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      this.notify();
    } catch {
      // storage quota or unavailable
    }
  }

  private loadSession(): UserProfile | null {
    try {
      const stored = localStorage.getItem(SESSION_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // ignore
    }
    // Default to Super Admin for seamless immediate evaluation
    const defaultUser = this.data.profiles[0] || null;
    if (defaultUser) {
      this.saveSession(defaultUser);
    }
    return defaultUser;
  }

  private saveSession(user: UserProfile | null): void {
    this.currentSession = user;
    try {
      if (user) {
        localStorage.setItem(SESSION_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(SESSION_KEY);
      }
      this.notify();
    } catch {
      // ignore
    }
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify(): void {
    this.listeners.forEach(l => l());
  }

  // Session & Auth
  public getSessionUser(): UserProfile | null {
    return this.currentSession;
  }

  public setSessionUser(user: UserProfile | null): void {
    this.saveSession(user);
    if (user) {
      this.logAudit({
        user_id: user.id,
        user_email: user.email,
        action: 'LOGIN',
        resource: 'auth',
        details: { role: user.role, name: user.full_name },
      });
    }
  }

  public switchRole(role: UserRole): UserProfile {
    if (!this.currentSession) {
      this.currentSession = this.data.profiles[0];
    }
    const updated = { ...this.currentSession, role };
    // update in profiles list
    this.data.profiles = this.data.profiles.map(p => p.id === updated.id ? updated : p);
    this.saveData(this.data);
    this.saveSession(updated);
    this.logAudit({
      user_id: updated.id,
      user_email: updated.email,
      action: 'PERM_CHANGE',
      resource: 'profiles',
      resource_id: updated.id,
      details: { new_role: role },
    });
    return updated;
  }

  public logAudit(entry: Omit<AuditLog, 'id' | 'organization_id' | 'created_at'>): AuditLog {
    const orgId = this.currentSession?.organization_id || DEFAULT_ORG_ID;
    const log: AuditLog = {
      id: `aud-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      organization_id: orgId,
      created_at: new Date().toISOString(),
      ip_address: '10.0.4.1',
      ...entry,
    };
    this.data.auditLogs.unshift(log);
    // Keep max 200 logs
    if (this.data.auditLogs.length > 200) {
      this.data.auditLogs.pop();
    }
    this.saveData(this.data);
    return log;
  }

  // Generic Getters
  public getOrganizations(): Organization[] {
    return this.data.organizations;
  }

  public getProfiles(): UserProfile[] {
    return this.data.profiles;
  }

  public getDepartments(): Department[] {
    return this.data.departments;
  }

  public getPositions(): Position[] {
    return this.data.positions;
  }

  public getAgents(): AIAgent[] {
    return this.data.agents;
  }

  public getAgencyAgentProfiles(): AgencyAgentProfile[] {
    return this.data.agencyAgentProfiles;
  }

  public getAgencyAgentProfileById(id: string): AgencyAgentProfile | undefined {
    return this.data.agencyAgentProfiles.find(p => p.id === id);
  }

  public getAgencyAgentProfileByCode(code: string): AgencyAgentProfile | undefined {
    return this.data.agencyAgentProfiles.find(p => p.code === code);
  }

  public setAgencyAgentProfiles(updater: (prev: AgencyAgentProfile[]) => AgencyAgentProfile[]): void {
    this.data.agencyAgentProfiles = updater(this.data.agencyAgentProfiles);
    this.saveData(this.data);
  }

  public getAgencyAgentSelections(): AgencyAgentSelection[] {
    return this.data.agencyAgentSelections;
  }

  public setAgencyAgentSelections(updater: (prev: AgencyAgentSelection[]) => AgencyAgentSelection[]): void {
    this.data.agencyAgentSelections = updater(this.data.agencyAgentSelections);
    this.saveData(this.data);
  }

  public getAgencyAgentHomologations(): AgencyAgentHomologation[] {
    return this.data.agencyAgentHomologations;
  }

  public setAgencyAgentHomologations(updater: (prev: AgencyAgentHomologation[]) => AgencyAgentHomologation[]): void {
    this.data.agencyAgentHomologations = updater(this.data.agencyAgentHomologations);
    this.saveData(this.data);
  }

  public getProjects(): Project[] {
    return this.data.projects;
  }

  public getTasks(): Task[] {
    return this.data.tasks;
  }

  public getDecisions(): Decision[] {
    return this.data.decisions;
  }

  public getDeliberations(): Deliberation[] {
    return this.data.deliberations;
  }

  public getDocuments(): GovernanceDocument[] {
    return this.data.documents;
  }

  public getAuditLogs(): AuditLog[] {
    return this.data.auditLogs;
  }

  // Mutations
  public updateDepartments(updater: (prev: Department[]) => Department[]): void {
    this.data.departments = updater(this.data.departments);
    this.saveData(this.data);
  }

  public updatePositions(updater: (prev: Position[]) => Position[]): void {
    this.data.positions = updater(this.data.positions);
    this.saveData(this.data);
  }

  public updateProfiles(updater: (prev: UserProfile[]) => UserProfile[]): void {
    this.data.profiles = updater(this.data.profiles);
    this.saveData(this.data);
  }

  public updateAgents(updater: (prev: AIAgent[]) => AIAgent[]): void {
    this.data.agents = updater(this.data.agents);
    this.saveData(this.data);
  }

  public updateProjects(updater: (prev: Project[]) => Project[]): void {
    this.data.projects = updater(this.data.projects);
    this.saveData(this.data);
  }

  public updateTasks(updater: (prev: Task[]) => Task[]): void {
    this.data.tasks = updater(this.data.tasks);
    this.saveData(this.data);
  }

  public updateDecisions(updater: (prev: Decision[]) => Decision[]): void {
    this.data.decisions = updater(this.data.decisions);
    this.saveData(this.data);
  }

  public updateDeliberations(updater: (prev: Deliberation[]) => Deliberation[]): void {
    this.data.deliberations = updater(this.data.deliberations);
    this.saveData(this.data);
  }

  public updateDocuments(updater: (prev: GovernanceDocument[]) => GovernanceDocument[]): void {
    this.data.documents = updater(this.data.documents);
    this.saveData(this.data);
  }
}

export const localStore = new LocalSupabaseStore();
