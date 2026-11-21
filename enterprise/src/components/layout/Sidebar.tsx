/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { NavigationItem } from './NavigationItem';
import {
  LayoutDashboard,
  Building2,
  Layers,
  Briefcase,
  Bot,
  FolderGit2,
  CheckSquare,
  Scale,
  Gavel,
  FileText,
  BrainCircuit,
  ShieldAlert,
  Settings,
  Users,
  User,
  PanelLeftClose,
  PanelLeftOpen,
  Compass
} from 'lucide-react';

interface SidebarProps {
  currentRoute: string;
  onNavigate: (route: string) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onToggleMobile: () => void;
  counts?: {
    tasks?: number;
    agents?: number;
    decisions?: number;
  };
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentRoute,
  onNavigate,
  collapsed,
  onToggleCollapse,
  mobileOpen,
  onToggleMobile,
  counts,
}) => {
  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 border-r border-nc-border bg-nc-surface h-screen flex flex-col justify-between transition-transform duration-200 ease-out shrink-0 ${
        mobileOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:static lg:inset-0 lg:translate-x-0 lg:block lg:z-auto ${
        collapsed ? 'lg:w-16' : 'lg:w-64'
      }`}
    >
      {/* Brand Zone */}
      <div>
        <div className="h-14 px-4 flex items-center justify-between border-b border-zinc-850">
          {!collapsed ? (
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-7 h-7 rounded bg-amber-400 flex items-center justify-center text-zinc-950 font-black text-sm shrink-0">
                N
              </div>
              <div className="truncate">
                <span className="text-xs font-bold tracking-tight text-zinc-100 uppercase block font-sans">
                  NettosCorp
                </span>
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block">
                  Enterprise
                </span>
              </div>
            </div>
          ) : (
            <div className="w-7 h-7 rounded bg-amber-400 flex items-center justify-center text-zinc-950 font-black text-sm mx-auto">
              N
            </div>
          )}

          <button
            onClick={onToggleCollapse}
            className={`p-1.5 text-nc-text-muted hover:text-nc-text hover:bg-nc-surface-hover rounded transition-colors ${
              collapsed || mobileOpen ? 'hidden' : 'lg:block'
            }`}
            aria-label="Recolher menu lateral"
          >
            <PanelLeftClose className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Groups */}
        <div className="p-2 space-y-5 overflow-y-auto max-h-[calc(100vh-8rem)]">
          {/* 1. Visão Executiva */}
          <div>
            {!collapsed && (
              <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 px-3 mb-1 block">
                Visão Geral
              </span>
            )}
            <NavigationItem
              label="Dashboard Executivo"
              icon={LayoutDashboard}
              active={currentRoute === '/dashboard'}
              onClick={() => onNavigate('/dashboard')}
              collapsed={collapsed}
            />
          </div>

          {/* 2. Organização */}
          <div>
            {!collapsed && (
              <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 px-3 mb-1 block">
                Organização
              </span>
            )}
            <div className="space-y-0.5">
              <NavigationItem
                label="Estrutura Organizacional"
                icon={Building2}
                active={currentRoute === '/organization'}
                onClick={() => onNavigate('/organization')}
                collapsed={collapsed}
              />
              <NavigationItem
                label="Departamentos"
                icon={Layers}
                active={currentRoute === '/organization/departments'}
                onClick={() => onNavigate('/organization/departments')}
                collapsed={collapsed}
              />
              <NavigationItem
                label="Cargos e Posições"
                icon={Briefcase}
                active={currentRoute === '/organization/positions'}
                onClick={() => onNavigate('/organization/positions')}
                collapsed={collapsed}
              />
            </div>
          </div>

          {/* 3. Operação & IA */}
          <div>
            {!collapsed && (
              <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 px-3 mb-1 block">
                Operação & IA
              </span>
            )}
            <div className="space-y-0.5">
              <NavigationItem
                label="Agentes de IA"
                icon={Bot}
                active={currentRoute.startsWith('/agents')}
                onClick={() => onNavigate('/agents')}
                badge={counts?.agents}
                collapsed={collapsed}
              />
              <NavigationItem
                label="Portfólio de Projetos"
                icon={FolderGit2}
                active={currentRoute.startsWith('/projects')}
                onClick={() => onNavigate('/projects')}
                collapsed={collapsed}
              />
              <NavigationItem
                label="Tarefas & Atividades"
                icon={CheckSquare}
                active={currentRoute === '/tasks'}
                onClick={() => onNavigate('/tasks')}
                badge={counts?.tasks}
                collapsed={collapsed}
              />
              <NavigationItem
                label="Biblioteca e Inteligência"
                icon={BrainCircuit}
                active={currentRoute === '/agency-catalog' || currentRoute.startsWith('/agency-intelligence')}
                onClick={() => onNavigate('/agency-intelligence')}
                collapsed={collapsed}
              />
            </div>
          </div>

          {/* 4. Governança Corporativa */}
          <div>
            {!collapsed && (
              <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 px-3 mb-1 block">
                Governança
              </span>
            )}
            <div className="space-y-0.5">
              <NavigationItem
                label="Portal de Governança"
                icon={Compass}
                active={currentRoute === '/governance'}
                onClick={() => onNavigate('/governance')}
                collapsed={collapsed}
              />
              <NavigationItem
                label="Registro DEC"
                icon={Gavel}
                active={currentRoute === '/decisions'}
                onClick={() => onNavigate('/decisions')}
                badge={counts?.decisions}
                collapsed={collapsed}
              />
              <NavigationItem
                label="Deliberações CNS"
                icon={Scale}
                active={currentRoute === '/deliberations'}
                onClick={() => onNavigate('/deliberations')}
                collapsed={collapsed}
              />
              <NavigationItem
                label="Documentos (DELIB)"
                icon={FileText}
                active={currentRoute === '/documents'}
                onClick={() => onNavigate('/documents')}
                collapsed={collapsed}
              />
            </div>
          </div>

          {/* 5. Auditoria & Administração */}
          <div>
            {!collapsed && (
              <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 px-3 mb-1 block">
                Administração
              </span>
            )}
            <div className="space-y-0.5">
              <NavigationItem
                label="Trilha de Auditoria"
                icon={ShieldAlert}
                active={currentRoute === '/audit'}
                onClick={() => onNavigate('/audit')}
                collapsed={collapsed}
              />
              <NavigationItem
                label="Usuários & Permissões"
                icon={Users}
                active={currentRoute === '/settings/users'}
                onClick={() => onNavigate('/settings/users')}
                collapsed={collapsed}
              />
              <NavigationItem
                label="Configurações & APIs"
                icon={Settings}
                active={currentRoute === '/settings'}
                onClick={() => onNavigate('/settings')}
                collapsed={collapsed}
              />
              <NavigationItem
                label="Perfil Pessoal"
                icon={User}
                active={currentRoute === '/profile'}
                onClick={() => onNavigate('/profile')}
                collapsed={collapsed}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Footer toggle for collapsed mode */}
      <div className={`p-3 border-t border-nc-border ${collapsed && !mobileOpen ? 'block' : 'hidden'} lg:block`}>
        {collapsed && (
          <button
            onClick={onToggleCollapse}
            className="w-full flex items-center justify-center p-2 text-nc-text-muted hover:text-nc-text hover:bg-nc-surface-hover rounded transition-colors"
            title="Expandir barra lateral"
          >
            <PanelLeftOpen className="w-4 h-4" />
          </button>
        )}
      </div>
    </aside>
  );
};
