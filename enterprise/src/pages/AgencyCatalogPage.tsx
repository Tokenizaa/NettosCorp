/** @license SPDX-License-Identifier: Apache-2.0 */

import React, { useState, useEffect, useCallback } from 'react';
import { agencyCatalogService } from '../services/agencyCatalogService';
import { localStore } from '../services/supabaseClient';
import {
  AgencyAgentProfile,
  AgencyAgentCategory,
  AgencyAgentStatus,
} from '../types';
import { PageHeader } from '../components/layout/PageHeader';
import { SearchInput } from '../components/data/SearchInput';
import { EmptyState } from '../components/data/EmptyState';
import { Modal } from '../components/forms/Modal';
import { FormField } from '../components/forms/FormField';
import { TextInput } from '../components/forms/TextInput';
import { SelectInput } from '../components/forms/SelectInput';
import { TextArea } from '../components/forms/TextArea';
import { FormActions } from '../components/forms/FormActions';
import {
  Bot,
  FileText,
  Search,
  Users,
  LayoutList,
  Scale,
  ShieldCheck,
  AlertTriangle,
  Plus,
  ChevronRight,
  X,
} from 'lucide-react';

const CATEGORIES: { value: AgencyAgentCategory; label: string }[] = [
  { value: 'strategy', label: 'Estratégia' },
  { value: 'operations', label: 'Operações' },
  { value: 'technology', label: 'Tecnologia' },
  { value: 'governance', label: 'Governança' },
  { value: 'finance', label: 'Financeiro' },
  { value: 'human-resources', label: 'Recursos Humanos' },
  { value: 'legal', label: 'Jurídico' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'sales', label: 'Vendas' },
  { value: 'product', label: 'Produto' },
  { value: 'research', label: 'Pesquisa' },
  { value: 'security', label: 'Segurança' },
  { value: 'compliance', label: 'Compliance' },
  { value: 'data', label: 'Dados' },
  { value: 'infrastructure', label: 'Infraestrutura' },
  { value: 'customer-success', label: 'Customer Success' },
  { value: 'communications', label: 'Comunicação' },
  { value: 'other', label: 'Outros' },
];

const STATUS_OPTIONS: { value: AgencyAgentStatus; label: string; color: string }[] = [
  { value: 'disponivel', label: 'Disponível', color: 'bg-emerald-500' },
  { value: 'em_avaliacao', label: 'Em Avaliação', color: 'bg-amber-500' },
  { value: 'homologado', label: 'Homologado', color: 'bg-emerald-600' },
  { value: 'nao_recomendado', label: 'Não Recomendado', color: 'bg-rose-500' },
];

interface AgencyCatalogPageProps {
  onNavigate: (route: string) => void;
}

export const AgencyCatalogPage: React.FC<AgencyCatalogPageProps> = ({ onNavigate }) => {
  const [profiles, setProfiles] = useState<AgencyAgentProfile[]>(agencyCatalogService.listProfiles());
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<AgencyAgentCategory | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<AgencyAgentStatus | 'all'>('all');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'view' | 'homologate'>('view');
  const [selectedProfile, setSelectedProfile] = useState<AgencyAgentProfile | null>(null);
  const [homologationStatus, setHomologationStatus] = useState<AgencyAgentStatus>('disponivel');
  const [homologationNotes, setHomologationNotes] = useState('');

  // Selection states
  const [isSelectionModalOpen, setIsSelectionModalOpen] = useState(false);
  const [selectionProject, setSelectionProject] = useState('');
  const [selectionPurpose, setSelectionPurpose] = useState('');

  useEffect(() => {
    const handleUpdate = () => {
      setProfiles(applyFilters());
    };
    return localStore.subscribe(handleUpdate);
  }, []);

  const applyFilters = useCallback(() => {
    let result = agencyCatalogService.listProfiles();

    if (search) {
      result = agencyCatalogService.searchProfiles(search);
    }
    if (categoryFilter !== 'all') {
      result = result.filter(p => p.category === categoryFilter);
    }
    if (statusFilter !== 'all') {
      result = result.filter(p => p.status === statusFilter);
    }

    return result.sort((a, b) => a.code.localeCompare(b.code));
  }, [search, categoryFilter, statusFilter]);

  const filteredProfiles = applyFilters();
  const stats = agencyCatalogService.stats();

  const openViewModal = (profile: AgencyAgentProfile) => {
    setSelectedProfile(profile);
    setModalType('view');
    setIsModalOpen(true);
  };

  const openHomologateModal = (profile: AgencyAgentProfile) => {
    setSelectedProfile(profile);
    setModalType('homologate');
    setHomologationStatus(profile.status);
    setHomologationNotes(profile.homologation_notes || '');
    setIsModalOpen(true);
  };

  const handleHomologate = () => {
    if (!selectedProfile) return;

    agencyCatalogService.homologateProfile({
      profile_id: selectedProfile.id,
      profile_code: selectedProfile.code,
      status: homologationStatus,
      reviewed_by: localStore.getSessionUser()?.id || 'system',
      reviewed_by_name: localStore.getSessionUser()?.full_name,
      notes: homologationNotes || undefined,
    });

    setIsModalOpen(false);
    setSelectedProfile(null);
  };

  const handleSelectForProject = () => {
    if (!selectedProfile) return;

    agencyCatalogService.createSelection({
      profile_id: selectedProfile.id,
      profile_code: selectedProfile.code,
      project_name: selectionProject,
      purpose: selectionPurpose,
      selected_by: localStore.getSessionUser()?.id || 'system',
      selected_by_name: localStore.getSessionUser()?.full_name,
      selected_at: new Date().toISOString(),
      status: 'planejado',
    });

    setIsSelectionModalOpen(false);
    setSelectedProfile(null);
    setSelectionProject('');
    setSelectionPurpose('');
  };

  const statusColor = (status: AgencyAgentStatus) => {
    const opt = STATUS_OPTIONS.find(o => o.value === status);
    return opt?.color || 'bg-zinc-500';
  };

  const categoryOptions = [
    { value: 'all', label: 'Todas categorias' },
    ...CATEGORIES.map(c => ({ value: c.value, label: c.label })),
  ];

  const statusOptions = [
    { value: 'all', label: 'Todos os status' },
    ...STATUS_OPTIONS.map(o => ({ value: o.value, label: o.label })),
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="Catálogo Agency Agents"
        description="Modelos profissionais para planejamento estratégico, avaliação e seleção de equipes"
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setSearch('');
                setCategoryFilter('all');
                setStatusFilter('all');
              }}
              className="px-3 py-2 text-sm font-medium text-zinc-400 hover:text-zinc-200 transition-colors"
            >
              Limpar filtros
            </button>
            <button
              onClick={() => setIsSelectionModalOpen(true)}
              className="flex items-center gap-2 px-3 py-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 rounded text-sm font-medium transition-colors"
            >
              <Plus className="w-4 h-4" /> Selecionar para projeto
            </button>
          </div>
        }
      />

      {/* Stats bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4">
          <div className="text-zinc-400 text-xs font-semibold uppercase tracking-wider mb-1">Total de modelos</div>
          <div className="text-2xl font-bold text-zinc-100">{stats.total}</div>
        </div>
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4">
          <div className="text-zinc-400 text-xs font-semibold uppercase tracking-wider mb-1">Homologados</div>
          <div className="text-2xl font-bold text-emerald-400">{stats.homologated}</div>
        </div>
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4">
          <div className="text-zinc-400 text-xs font-semibold uppercase tracking-wider mb-1">Em avaliação</div>
          <div className="text-2xl font-bold text-amber-400">{stats.evaluating}</div>
        </div>
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4">
          <div className="text-zinc-400 text-xs font-semibold uppercase tracking-wider mb-1">Não recomendados</div>
          <div className="text-2xl font-bold text-rose-400">{stats.notRecommended}</div>
        </div>
      </div>

      {/* Search & filters */}
      <div className="flex flex-col lg:flex-row gap-4 items-end">
        <div className="flex-1">
          <SearchInput
            placeholder="Buscar por nome, código, identidade ou competências..."
            value={search}
            onChange={setSearch}
          />
        </div>
        <div className="min-w-[200px]">
          <SelectInput
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value as AgencyAgentCategory | 'all')}
            options={categoryOptions}
          />
        </div>
        <div className="min-w-[200px]">
          <SelectInput
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value as AgencyAgentStatus | 'all')}
            options={statusOptions}
          />
        </div>
      </div>

      {/* Catalog grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProfiles.length === 0 ? (
          <EmptyState
            icon={Search}
            title="Nenhum modelo encontrado"
            description="Ajuste os filtros de busca ou importe novos perfis do catálogo Agency Agents."
          />
        ) : (
          filteredProfiles.map(profile => (
            <div
              key={profile.id}
              className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 hover:border-zinc-600 transition-colors cursor-pointer group"
              onClick={() => openViewModal(profile)}
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-semibold text-zinc-100">{profile.name}</h3>
                  <span className="text-xs font-mono text-zinc-500">{profile.code}</span>
                </div>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${statusColor(profile.status)} text-zinc-950`}
                >
                  {STATUS_OPTIONS.find(o => o.value === profile.status)?.label || profile.status}
                </span>
              </div>
              <p className="text-zinc-400 text-sm mb-3 line-clamp-2">{profile.identity}</p>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-zinc-500">{CATEGORIES.find(c => c.value === profile.category)?.label}</span>
                <span className="text-xs text-zinc-500">{profile.specialty_description}</span>
              </div>
              <div className="flex flex-wrap gap-1 mb-3">
                {profile.competencies.slice(0, 4).map(c => (
                  <span key={c} className="px-2 py-1 bg-zinc-800/50 border border-zinc-800 rounded text-xs text-zinc-300">
                    {c}
                  </span>
                ))}
                {profile.competencies.length > 4 && (
                  <span className="px-2 py-1 bg-zinc-800/50 border border-zinc-800 rounded text-xs text-zinc-500">
                    +{profile.competencies.length - 4}
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* View / Homologate Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedProfile(null);
        }}
        title={modalType === 'homologate' ? 'Homologar modelo' : 'Ficha do modelo'}
      >
        {modalType === 'view' && selectedProfile && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="flex items-start justify-between mb-1">
                  <h3 className="text-lg font-bold text-zinc-100">{selectedProfile.name}</h3>
                  <span
                    className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${statusColor(selectedProfile.status)} text-zinc-950`}
                  >
                    {STATUS_OPTIONS.find(o => o.value === selectedProfile.status)?.label}
                  </span>
                </div>
                <p className="text-xs font-mono text-zinc-500 mb-2">{selectedProfile.code}</p>
                <h4 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-1">Identidade</h4>
                <p className="text-zinc-300 text-sm leading-relaxed">{selectedProfile.identity}</p>
                <h4 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-1 mt-4">Descrição da especialidade</h4>
                <p className="text-zinc-300 text-sm">{selectedProfile.specialty_description}</p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-1">Categoria</h4>
                <p className="text-zinc-300 text-sm">{CATEGORIES.find(c => c.value === selectedProfile.category)?.label}</p>
                <h4 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-1 mt-4">Competências</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedProfile.competencies.map(c => (
                    <span key={c} className="px-2 py-1 bg-zinc-800/50 border border-zinc-800 rounded text-xs text-zinc-300">
                      {c}
                    </span>
                  ))}
                </div>
                <h4 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-1 mt-4">Personalidade</h4>
                <p className="text-zinc-300 text-sm italic">{selectedProfile.personality}</p>
              </div>
            </div>
            <h4 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-1">Responsabilidades</h4>
            <ul className="list-disc list-inside text-zinc-300 text-sm space-y-1">
              {selectedProfile.responsibilities.map(r => (
                <li key={r}>{r}</li>
              ))}
            </ul>
            <h4 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-1 mt-4">Metodologia</h4>
            <p className="text-zinc-300 text-sm leading-relaxed">{selectedProfile.methodology}</p>
            {selectedProfile.source_file && (
              <div className="mt-4 pt-4 border-t border-zinc-800">
                <p className="text-xs text-zinc-500">Arquivo origem: {selectedProfile.source_file}</p>
              </div>
            )}
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setModalType('homologate');
                }}
                className="flex-1 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded text-sm font-medium transition-colors"
              >
                Homologar
              </button>
              <button
                onClick={() => {
                  setIsSelectionModalOpen(true);
                }}
                className="flex-1 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 rounded text-sm font-medium transition-colors"
              >
                Selecionar para projeto
              </button>
            </div>
          </div>
        )}
        {modalType === 'homologate' && selectedProfile && (
          <form onSubmit={e => { e.preventDefault(); handleHomologate(); }} className="space-y-4">
            <div>
              <h3 className="text-lg font-bold text-zinc-100 mb-1">{selectedProfile.name}</h3>
              <p className="text-xs font-mono text-zinc-500">{selectedProfile.code}</p>
            </div>
            <FormField label="Novo status de homologação">
              <SelectInput
                value={homologationStatus}
                onChange={e => setHomologationStatus(e.target.value as AgencyAgentStatus)}
                options={STATUS_OPTIONS.map(o => ({ value: o.value, label: o.label }))}
              />
            </FormField>
            <FormField label="Observações da homologação">
              <TextArea value={homologationNotes} onChange={e => setHomologationNotes(e.target.value)} rows={3} />
            </FormField>
            <div className="text-xs text-zinc-500">
              Esta operação registra a decisão de homologação e atualiza o status do modelo no catálogo.
              Não cria nem exclui agentes operacionais no Paperclip.
            </div>
            <FormActions
              onCancel={() => {
                setIsModalOpen(false);
                setSelectedProfile(null);
              }}
              submitLabel="Confirmar homologação"
              cancelLabel="Cancelar"
            />
          </form>
        )}
      </Modal>

      {/* Selection Modal */}
      <Modal
        isOpen={isSelectionModalOpen}
        onClose={() => {
          setIsSelectionModalOpen(false);
          setSelectedProfile(null);
          setSelectionProject('');
          setSelectionPurpose('');
        }}
        title="Selecionar modelo para projeto"
      >
        {selectedProfile && (
          <form onSubmit={e => { e.preventDefault(); handleSelectForProject(); }} className="space-y-4">
            <div className="bg-zinc-800/50 border border-zinc-800 rounded-lg p-3">
              <h4 className="text-sm font-semibold text-zinc-100 mb-1">Modelo selecionado</h4>
              <p className="text-xs text-zinc-400">{selectedProfile.name} ({selectedProfile.code})</p>
            </div>
            <FormField label="Nome do projeto">
              <TextInput
                value={selectionProject}
                onChange={e => setSelectionProject(e.target.value)}
                placeholder="Ex: Plataforma de Atendimento ao Cliente"
              />
            </FormField>
            <FormField label="Propósito da seleção">
              <TextArea
                value={selectionPurpose}
                onChange={e => setSelectionPurpose(e.target.value)}
                rows={2}
                placeholder="Por que este modelo foi selecionado para este projeto?"
              />
            </FormField>
            <div className="text-xs text-zinc-500">
              A seleção registra o modelo para planejamento de equipes futuras. Não cadastra o modelo como
              agente operacional no Paperclip.
            </div>
            <FormActions
              onCancel={() => {
                setIsSelectionModalOpen(false);
                setSelectedProfile(null);
                setSelectionProject('');
                setSelectionPurpose('');
              }}
              submitLabel="Confirmar seleção"
              cancelLabel="Cancelar"
            />
          </form>
        )}
      </Modal>
    </div>
  );
};
