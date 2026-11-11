/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Department, Position, Organization, AIAgent } from '../../types';
import { StatusBadge } from './StatusBadge';
import { localStore } from '../../services/supabaseClient';
import {
  Building2,
  Layers,
  Briefcase,
  Users,
  ChevronDown,
  ChevronRight,
  Bot,
  User,
  ArrowRight,
  Shield,
  FolderGit2,
  Network,
  ListTree
} from 'lucide-react';

interface OrganizationTreeProps {
  organization: Organization;
  departments: Department[];
  positions: Position[];
  onSelectDepartment?: (dept: Department) => void;
}

export const OrganizationTree: React.FC<OrganizationTreeProps> = ({
  organization,
  departments,
  positions,
  onSelectDepartment,
}) => {
  const [viewFormat, setViewFormat] = useState<'chart' | 'list'>('chart');
  const [selectedDeptId, setSelectedDeptId] = useState<string>(departments[0]?.id || 'dept-001');
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({
    'dept-001': true,
    'dept-002': true,
    'dept-003': true,
    'dept-004': true,
  });

  const allAgents = localStore.getAgents();
  const allProjects = localStore.getProjects();
  const allMembers = localStore.getProfiles();

  const toggleNode = (id: string) => {
    setExpandedNodes(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const selectedDept = departments.find(d => d.id === selectedDeptId) || departments[0];
  const deptPositions = positions.filter(p => p.department_id === selectedDept?.id);
  const deptAgents = allAgents.filter(a => a.assigned_department_id === selectedDept?.id);
  const deptProjects = allProjects.filter(p => p.department_id === selectedDept?.id);
  const deptMembers = allMembers.filter(m => m.department_id === selectedDept?.id);

  return (
    <div className="space-y-4">
      {/* View Switcher & Toolbar */}
      <div className="flex items-center justify-between p-3 bg-zinc-900 border border-zinc-800 rounded-lg">
        <div className="flex items-center gap-2">
          <Network className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-semibold text-zinc-200">Visualização Estrutural</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center bg-zinc-950 border border-zinc-800 rounded p-0.5">
            <button
              onClick={() => setViewFormat('chart')}
              className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded transition-colors ${
                viewFormat === 'chart'
                  ? 'bg-zinc-800 text-amber-400 shadow-xs'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Network className="w-3.5 h-3.5" />
              <span>Organograma Visual</span>
            </button>
            <button
              onClick={() => setViewFormat('list')}
              className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded transition-colors ${
                viewFormat === 'list'
                  ? 'bg-zinc-800 text-amber-400 shadow-xs'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <ListTree className="w-3.5 h-3.5" />
              <span>Lista Hierárquica</span>
            </button>
          </div>
        </div>
      </div>

      {viewFormat === 'chart' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Visual Chart Canvas (2 cols) */}
          <div className="lg:col-span-2 p-6 bg-zinc-900/60 border border-zinc-800 rounded-lg overflow-x-auto">
            {/* Level 0: Conselho & Presidência */}
            <div className="flex flex-col items-center">
              <div className="p-4 bg-zinc-950 border-2 border-amber-500/60 rounded-lg shadow-xl w-72 text-center relative hover:border-amber-400 transition-colors">
                <div className="w-8 h-8 rounded-full bg-amber-400/10 border border-amber-400/40 text-amber-400 flex items-center justify-center mx-auto mb-2 font-bold text-xs">
                  N
                </div>
                <h4 className="text-sm font-bold text-zinc-100">{organization.name}</h4>
                <p className="text-[11px] font-mono text-zinc-400 mt-0.5">
                  Conselho de Administração & Diretoria Geral
                </p>
                <div className="mt-2 pt-2 border-t border-zinc-800/80 flex items-center justify-center gap-2 text-[10px] text-zinc-500 font-mono">
                  <span>{departments.length} Unidades</span>
                  <span>·</span>
                  <span>{positions.length} Posições</span>
                </div>
              </div>

              {/* Connecting Vertical Stem */}
              <div className="w-0.5 h-8 bg-zinc-700 my-0"></div>

              {/* Horizontal Connecting Branch */}
              <div className="w-5/6 h-0.5 bg-zinc-700 relative hidden md:block">
                <div className="absolute left-0 -top-1 w-2.5 h-2.5 rounded-full bg-zinc-600"></div>
                <div className="absolute right-0 -top-1 w-2.5 h-2.5 rounded-full bg-zinc-600"></div>
              </div>

              {/* Level 1: Operational Departments Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full mt-4">
                {departments.map(dept => {
                  const isSelected = selectedDeptId === dept.id;
                  const deptPosCount = positions.filter(p => p.department_id === dept.id).length;
                  const deptAgentCount = allAgents.filter(a => a.assigned_department_id === dept.id).length;

                  return (
                    <div
                      key={dept.id}
                      onClick={() => setSelectedDeptId(dept.id)}
                      className={`p-4 rounded-lg border transition-all cursor-pointer select-none text-left ${
                        isSelected
                          ? 'bg-zinc-900 border-amber-400 shadow-lg shadow-amber-500/5 ring-1 ring-amber-400/40'
                          : 'bg-zinc-950/70 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/40'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <div className="flex items-center gap-2">
                          <Layers className={`w-4 h-4 ${isSelected ? 'text-amber-400' : 'text-zinc-500'}`} />
                          <span className="text-[10px] font-mono text-zinc-500">{dept.code}</span>
                        </div>
                        <StatusBadge status={dept.status} />
                      </div>

                      <h5 className="text-xs font-bold text-zinc-100">{dept.name}</h5>
                      <p className="text-[11px] text-zinc-400 mt-1 line-clamp-2">
                        {dept.description}
                      </p>

                      <div className="mt-3 pt-2.5 border-t border-zinc-850 flex items-center justify-between text-[11px]">
                        <span className="text-zinc-400 truncate max-w-[130px]">
                          {dept.manager_name || 'Liderança Aberta'}
                        </span>

                        <div className="flex items-center gap-2 text-zinc-500 font-mono text-[10px]">
                          <span title="Posições homologadas">💼 {deptPosCount}</span>
                          {deptAgentCount > 0 && (
                            <span title="Agentes IA alocados" className="text-amber-400">
                              🤖 {deptAgentCount}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Department Inspection Panel (1 col) */}
          <div className="p-5 bg-zinc-900/80 border border-zinc-800 rounded-lg space-y-4">
            <div className="flex items-start justify-between pb-3 border-b border-zinc-800">
              <div>
                <span className="text-[10px] font-mono text-amber-400 uppercase tracking-wider block">
                  {selectedDept?.code} · Unidade Selecionada
                </span>
                <h4 className="text-sm font-bold text-zinc-100 mt-0.5">{selectedDept?.name}</h4>
              </div>
              <button
                onClick={() => onSelectDepartment?.(selectedDept)}
                className="text-xs text-amber-400 hover:text-amber-300 font-medium flex items-center gap-1"
              >
                <span>Gestão</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Department Leader */}
            <div className="p-3 bg-zinc-950 rounded border border-zinc-800/80 text-xs">
              <span className="text-zinc-500 block text-[10px] uppercase font-mono">Gestor Titular:</span>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-6 h-6 rounded bg-zinc-800 flex items-center justify-center text-amber-400 font-bold text-[10px]">
                  {selectedDept?.manager_name ? selectedDept.manager_name.charAt(0) : 'G'}
                </div>
                <span className="text-zinc-200 font-semibold">{selectedDept?.manager_name || 'Não atribuído'}</span>
              </div>
            </div>

            {/* Posições Homologadas */}
            <div>
              <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block mb-2">
                Quadro de Cargos ({deptPositions.length})
              </span>
              <div className="space-y-1.5 max-h-40 overflow-y-auto">
                {deptPositions.length === 0 ? (
                  <p className="text-xs text-zinc-500 italic">Nenhum cargo associado.</p>
                ) : (
                  deptPositions.map(pos => (
                    <div
                      key={pos.id}
                      className="p-2 rounded bg-zinc-950/60 border border-zinc-850 flex items-center justify-between text-xs"
                    >
                      <span className="text-zinc-200 font-medium truncate">{pos.title}</span>
                      <span className="text-[10px] font-mono text-zinc-400 bg-zinc-900 px-1.5 py-0.5 rounded border border-zinc-800 shrink-0">
                        {pos.level}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Agentes de IA da Unidade */}
            <div>
              <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
                <Bot className="w-3.5 h-3.5 text-amber-400" /> Agentes Alocados ({deptAgents.length})
              </span>
              <div className="space-y-1.5">
                {deptAgents.length === 0 ? (
                  <p className="text-xs text-zinc-500 italic">Nenhum agente autônomo nesta divisão.</p>
                ) : (
                  deptAgents.map(ag => (
                    <div
                      key={ag.id}
                      className="p-2 rounded bg-zinc-950/60 border border-zinc-850 flex items-center justify-between text-xs"
                    >
                      <div>
                        <span className="text-zinc-200 font-medium block">{ag.name}</span>
                        <span className="text-[10px] font-mono text-zinc-500">{ag.code} · {ag.model}</span>
                      </div>
                      <StatusBadge status={ag.status} />
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Projetos da Unidade */}
            <div>
              <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
                <FolderGit2 className="w-3.5 h-3.5 text-amber-400" /> Projetos sob Gestão ({deptProjects.length})
              </span>
              <div className="space-y-1.5">
                {deptProjects.length === 0 ? (
                  <p className="text-xs text-zinc-500 italic">Nenhum projeto associado.</p>
                ) : (
                  deptProjects.map(prj => (
                    <div
                      key={prj.id}
                      className="p-2 rounded bg-zinc-950/60 border border-zinc-850 flex items-center justify-between text-xs"
                    >
                      <span className="text-zinc-200 font-medium truncate">{prj.name}</span>
                      <StatusBadge status={prj.status} />
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Detailed Hierarchical List */
        <div className="p-6 bg-zinc-900/60 border border-zinc-800 rounded-lg space-y-3">
          {departments.map(dept => {
            const isExpanded = Boolean(expandedNodes[dept.id]);
            const deptPos = positions.filter(p => p.department_id === dept.id);
            const deptAg = allAgents.filter(a => a.assigned_department_id === dept.id);

            return (
              <div key={dept.id} className="border border-zinc-800 rounded bg-zinc-950/40 overflow-hidden">
                <div
                  onClick={() => toggleNode(dept.id)}
                  className="flex items-center justify-between p-3.5 hover:bg-zinc-800/40 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <button className="text-zinc-500 hover:text-zinc-200">
                      {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    </button>
                    <Layers className="w-4 h-4 text-amber-400" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-zinc-100">{dept.name}</span>
                        <span className="text-[10px] font-mono text-zinc-500 bg-zinc-900 px-1.5 py-0.2 rounded border border-zinc-800">
                          {dept.code}
                        </span>
                      </div>
                      <span className="text-[11px] text-zinc-400">
                        Gestor: {dept.manager_name || 'Liderança não atribuída'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono text-zinc-400">
                      {dept.headcount || 0} integrantes
                    </span>
                    <StatusBadge status={dept.status} />
                  </div>
                </div>

                {isExpanded && (
                  <div className="px-6 py-4 border-t border-zinc-800/80 bg-zinc-900/30 space-y-3">
                    {/* Positions */}
                    <div>
                      <span className="text-[10px] font-semibold uppercase text-zinc-500 tracking-wider block mb-1.5">
                        Cargos & Posições ({deptPos.length})
                      </span>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {deptPos.map(pos => (
                          <div
                            key={pos.id}
                            className="p-2 rounded bg-zinc-950 border border-zinc-800 flex items-center justify-between text-xs"
                          >
                            <span className="text-zinc-200 font-medium">{pos.title}</span>
                            <span className="text-[10px] font-mono text-zinc-400 bg-zinc-900 px-1.5 py-0.5 rounded border border-zinc-800">
                              {pos.level}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Agents */}
                    {deptAg.length > 0 && (
                      <div>
                        <span className="text-[10px] font-semibold uppercase text-zinc-500 tracking-wider block mb-1.5">
                          Agentes Cognitivos Alocados ({deptAg.length})
                        </span>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {deptAg.map(ag => (
                            <div
                              key={ag.id}
                              className="p-2 rounded bg-zinc-950 border border-zinc-800 flex items-center justify-between text-xs"
                            >
                              <span className="text-zinc-200 font-medium">🤖 {ag.name}</span>
                              <span className="text-[10px] font-mono text-amber-400">{ag.model}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
