/** @license SPDX-License-Identifier: Apache-2.0 */

import { localStore } from './supabaseClient';
import {
  AgencyAgentProfile,
  AgencyAgentSelection,
  AgencyAgentHomologation,
  AgencyAgentCategory,
  AgencyAgentStatus,
} from '../types';

const DEFAULT_ORG_ID = 'org-nettos-001';

function now(): string {
  return new Date().toISOString();
}

function generateId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
}

export const agencyCatalogService = {
  // ── Perfis ──────────────────────────────────────────────────────────────

  listProfiles(): AgencyAgentProfile[] {
    const user = localStore.getSessionUser();
    const orgId = user?.organization_id || DEFAULT_ORG_ID;
    return localStore.getAgencyAgentProfiles().filter(p => p.organization_id === orgId);
  },

  listProfilesByCategory(category: AgencyAgentCategory): AgencyAgentProfile[] {
    return this.listProfiles().filter(p => p.category === category);
  },

  listProfilesByStatus(status: AgencyAgentStatus): AgencyAgentProfile[] {
    return this.listProfiles().filter(p => p.status === status);
  },

  searchProfiles(query: string): AgencyAgentProfile[] {
    const q = query.toLowerCase();
    return this.listProfiles().filter(
      p =>
        p.name.toLowerCase().includes(q) ||
        p.code.toLowerCase().includes(q) ||
        p.identity.toLowerCase().includes(q) ||
        p.specialty_description.toLowerCase().includes(q) ||
        p.competencies.some(c => c.toLowerCase().includes(q)) ||
        p.responsibilities.some(r => r.toLowerCase().includes(q))
    );
  },

  getProfileById(id: string): AgencyAgentProfile | undefined {
    return localStore.getAgencyAgentProfileById(id);
  },

  getProfileByCode(code: string): AgencyAgentProfile | undefined {
    return localStore.getAgencyAgentProfileByCode(code);
  },

  upsertProfile(data: {
    category: AgencyAgentCategory;
    specialty: string;
    name: string;
    code: string;
    identity: string;
    specialty_description: string;
    competencies: string[];
    personality: string;
    responsibilities: string[];
    methodology: string;
    status: AgencyAgentStatus;
    source_file: string;
    source_hash: string;
  }): AgencyAgentProfile {
    const user = localStore.getSessionUser();
    const orgId = user?.organization_id || DEFAULT_ORG_ID;
    const nowStr = now();

    const existing = localStore.getAgencyAgentProfileByCode(data.code);

    const profile: AgencyAgentProfile = existing
      ? {
          ...existing,
          ...data,
          organization_id: existing.organization_id,
          id: existing.id,
          created_at: existing.created_at,
          updated_at: nowStr,
        }
      : {
          id: generateId('agt'),
          organization_id: orgId,
          created_at: nowStr,
          updated_at: nowStr,
          ...data,
        };

    localStore.setAgencyAgentProfiles(prev => {
      if (existing) {
        return prev.map(p => (p.id === profile.id ? profile : p));
      }
      return [profile, ...prev];
    });

    localStore.logAudit({
      user_id: user?.id || 'system',
      user_email: user?.email || 'system',
      action: existing ? 'UPDATE' : 'CREATE',
      resource: 'agencyAgentProfiles',
      resource_id: profile.id,
      details: {
        code: profile.code,
        name: profile.name,
        category: profile.category,
        status: profile.status,
      },
    });

    return profile;
  },

  importProfiles(profiles: {
    category: AgencyAgentCategory;
    specialty: string;
    name: string;
    code: string;
    identity: string;
    specialty_description: string;
    competencies: string[];
    personality: string;
    responsibilities: string[];
    methodology: string;
    status: AgencyAgentStatus;
    source_file: string;
    source_hash: string;
  }[]): AgencyAgentProfile[] {
    const user = localStore.getSessionUser();
    const orgId = user?.organization_id || DEFAULT_ORG_ID;
    const nowStr = now();

    const imported: AgencyAgentProfile[] = profiles.map(data => {
      const existing = localStore.getAgencyAgentProfileByCode(data.code);
      if (existing) {
        return {
          ...existing,
          ...data,
          organization_id: existing.organization_id,
          id: existing.id,
          created_at: existing.created_at,
          updated_at: nowStr,
        };
      }
      return {
        id: generateId('agt'),
        organization_id: orgId,
        created_at: nowStr,
        updated_at: nowStr,
        ...data,
      };
    });

    localStore.setAgencyAgentProfiles(prev => {
      const byCode = new Map(imported.map(p => [p.code, p]));
      const kept = prev.filter(p => !byCode.has(p.code));
      return [...imported, ...kept];
    });

    localStore.logAudit({
      user_id: user?.id || 'system',
      user_email: user?.email || 'system',
      action: 'CREATE',
      resource: 'agencyAgentProfiles',
      details: { count: imported.length, codes: imported.map(p => p.code) },
    });

    return imported;
  },

  // ── Seleções ────────────────────────────────────────────────────────────

  listSelections(): AgencyAgentSelection[] {
    const user = localStore.getSessionUser();
    const orgId = user?.organization_id || DEFAULT_ORG_ID;
    return localStore.getAgencyAgentSelections().filter(s => s.organization_id === orgId);
  },

  createSelection(data: {
    profile_id: string;
    profile_code?: string;
    project_name: string;
    purpose: string;
    selected_by: string;
    selected_by_name?: string;
    selected_at: string;
    status: 'planejado' | 'ativo' | 'concluído' | 'cancelado';
    notes?: string;
  }): AgencyAgentSelection {
    const user = localStore.getSessionUser();
    const orgId = user?.organization_id || DEFAULT_ORG_ID;
    const nowStr = now();

    const selection: AgencyAgentSelection = {
      id: generateId('sel'),
      organization_id: orgId,
      created_at: nowStr,
      updated_at: nowStr,
      ...data,
    };

    localStore.setAgencyAgentSelections(prev => [selection, ...prev]);

    localStore.logAudit({
      user_id: user?.id || 'system',
      user_email: user?.email || 'system',
      action: 'CREATE',
      resource: 'agencyAgentSelections',
      resource_id: selection.id,
      details: {
        project_name: selection.project_name,
        profile_code: selection.profile_code,
        status: selection.status,
      },
    });

    return selection;
  },

  updateSelection(id: string, updates: Partial<AgencyAgentSelection>): AgencyAgentSelection {
    const user = localStore.getSessionUser();
    let updated: AgencyAgentSelection | null = null;

    localStore.setAgencyAgentSelections(prev =>
      prev.map(s => {
        if (s.id === id) {
          updated = { ...s, ...updates, updated_at: now() };
          return updated;
        }
        return s;
      })
    );

    if (!updated) throw new Error('Seleção não encontrada.');

    localStore.logAudit({
      user_id: user?.id || 'system',
      user_email: user?.email || 'system',
      action: 'UPDATE',
      resource: 'agencyAgentSelections',
      resource_id: id,
      details: updates,
    });

    return updated;
  },

  deleteSelection(id: string): void {
    const user = localStore.getSessionUser();
    const selection = this.listSelections().find(s => s.id === id);
    if (!selection) return;

    localStore.setAgencyAgentSelections(prev => prev.filter(s => s.id !== id));

    localStore.logAudit({
      user_id: user?.id || 'system',
      user_email: user?.email || 'system',
      action: 'DELETE',
      resource: 'agencyAgentSelections',
      resource_id: id,
      details: { project_name: selection.project_name },
    });
  },

  // ── Homologações ────────────────────────────────────────────────────────

  listHomologations(): AgencyAgentHomologation[] {
    const user = localStore.getSessionUser();
    const orgId = user?.organization_id || DEFAULT_ORG_ID;
    return localStore.getAgencyAgentHomologations().filter(h => h.organization_id === orgId);
  },

  homologateProfile(data: {
    profile_id: string;
    profile_code?: string;
    status: AgencyAgentStatus;
    reviewed_by: string;
    reviewed_by_name?: string;
    notes?: string;
  }): AgencyAgentHomologation {
    const user = localStore.getSessionUser();
    const orgId = user?.organization_id || DEFAULT_ORG_ID;
    const nowStr = now();

    const homologation: AgencyAgentHomologation = {
      id: generateId('hom'),
      organization_id: orgId,
      created_at: nowStr,
      updated_at: nowStr,
      reviewed_at: nowStr,
      ...data,
    };

    // Atualiza o status do perfil também
    localStore.setAgencyAgentProfiles(prev =>
      prev.map(p => {
        if (p.id === data.profile_id || p.code === data.profile_code) {
          return {
            ...p,
            status: data.status,
            homologated_at: nowStr,
            homologated_by: data.reviewed_by,
            homologation_notes: data.notes,
            updated_at: nowStr,
          };
        }
        return p;
      })
    );

    localStore.setAgencyAgentHomologations(prev => [homologation, ...prev]);

    localStore.logAudit({
      user_id: user?.id || 'system',
      user_email: user?.email || 'system',
      action: 'STATUS_CHANGE',
      resource: 'agencyAgentHomologations',
      resource_id: homologation.id,
      details: {
        profile_code: data.profile_code,
        status: data.status,
        reviewed_by: data.reviewed_by,
      },
    });

    return homologation;
  },

  // ── Estatísticas ────────────────────────────────────────────────────────

  stats() {
    const profiles = this.listProfiles();
    const byCategory = profiles.reduce<Record<string, number>>((acc, p) => {
      acc[p.category] = (acc[p.category] || 0) + 1;
      return acc;
    }, {});
    const byStatus = profiles.reduce<Record<string, number>>((acc, p) => {
      acc[p.status] = (acc[p.status] || 0) + 1;
      return acc;
    }, {});
    return {
      total: profiles.length,
      byCategory,
      byStatus,
      homologated: profiles.filter(p => p.status === 'homologado').length,
      notRecommended: profiles.filter(p => p.status === 'nao_recomendado').length,
      available: profiles.filter(p => p.status === 'disponivel').length,
      evaluating: profiles.filter(p => p.status === 'em_avaliacao').length,
    };
  },
};
