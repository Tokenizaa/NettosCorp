/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { authService } from '../services/authService';
import { UserRole } from '../types';
import { ROLE_LABELS } from '../services/permissionService';
import { Shield, ArrowRight, Lock, Mail, CheckCircle2, AlertCircle } from 'lucide-react';

interface LoginPageProps {
  onNavigate: (route: string) => void;
  onLoginSuccess: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onNavigate, onLoginSuccess }) => {
  const [email, setEmail] = useState('admin@nettoscorp.com');
  const [password, setPassword] = useState('corporate123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await authService.login(email, password);
    setLoading(false);

    if (res.error) {
      setError(res.error);
    } else {
      onLoginSuccess();
      onNavigate('/dashboard');
    }
  };

  const handleQuickRole = async (targetEmail: string, role: UserRole) => {
    setEmail(targetEmail);
    setPassword('corporate123');
    setLoading(true);
    setError(null);
    const res = await authService.login(targetEmail, 'corporate123');
    if (res.user) {
      authService.switchRole(role);
      onLoginSuccess();
      onNavigate('/dashboard');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md">
        {/* Brand Lockup */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded bg-amber-400 flex items-center justify-center text-zinc-950 font-black text-xl mx-auto mb-3 shadow-lg">
            N
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-100 font-sans">
            NettosCorp Enterprise
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Plataforma Corporativa de Governança, IA e Auditoria
          </p>
        </div>

        {/* Card Form */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 shadow-2xl">
          <div className="mb-5">
            <h2 className="text-base font-semibold text-zinc-200">Acesso Corporativo</h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              Autenticação integrada com Supabase Auth e RLS
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded bg-rose-950/40 border border-rose-800/40 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">
                E-mail Institucional
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 w-4 h-4 text-zinc-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="usuario@nettoscorp.com"
                  className="w-full pl-9 pr-3 py-2 text-sm bg-zinc-950 border border-zinc-800 rounded text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-medium text-zinc-300">Senha de Acesso</label>
                <button
                  type="button"
                  onClick={() => onNavigate('/forgot-password')}
                  className="text-xs text-amber-400 hover:text-amber-300 transition-colors"
                >
                  Recuperar senha?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 w-4 h-4 text-zinc-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-3 py-2 text-sm bg-zinc-950 border border-zinc-800 rounded text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-500 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-zinc-950 bg-amber-400 hover:bg-amber-300 rounded transition-colors disabled:opacity-50 mt-2"
            >
              <span>{loading ? 'Validando Credenciais...' : 'Entrar na Plataforma'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Evaluator Access */}
          <div className="mt-6 pt-5 border-t border-zinc-800">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 block mb-2 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-amber-400" /> Acesso Rápido para Avaliação de Papéis
            </span>
            <div className="grid grid-cols-2 gap-1.5 text-xs">
              <button
                type="button"
                onClick={() => handleQuickRole('admin@nettoscorp.com', 'super_admin')}
                className="text-left px-2.5 py-1.5 rounded bg-zinc-950 hover:bg-zinc-800/80 border border-zinc-800 text-zinc-300 hover:text-amber-300 transition-colors"
              >
                <strong className="block text-zinc-200 text-[11px]">Super Admin</strong>
                <span className="text-[10px] text-zinc-500 truncate block">Dr. Orlando Netto</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickRole('diretoria@nettoscorp.com', 'director')}
                className="text-left px-2.5 py-1.5 rounded bg-zinc-950 hover:bg-zinc-800/80 border border-zinc-800 text-zinc-300 hover:text-amber-300 transition-colors"
              >
                <strong className="block text-zinc-200 text-[11px]">Diretora (DEC/CNS)</strong>
                <span className="text-[10px] text-zinc-500 truncate block">Helena Valença</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickRole('gerencia@nettoscorp.com', 'manager')}
                className="text-left px-2.5 py-1.5 rounded bg-zinc-950 hover:bg-zinc-800/80 border border-zinc-800 text-zinc-300 hover:text-amber-300 transition-colors"
              >
                <strong className="block text-zinc-200 text-[11px]">Gerente de Operações</strong>
                <span className="text-[10px] text-zinc-500 truncate block">Marcus Bastos</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickRole('auditor@nettoscorp.com', 'viewer')}
                className="text-left px-2.5 py-1.5 rounded bg-zinc-950 hover:bg-zinc-800/80 border border-zinc-800 text-zinc-300 hover:text-amber-300 transition-colors"
              >
                <strong className="block text-zinc-200 text-[11px]">Auditor (Viewer)</strong>
                <span className="text-[10px] text-zinc-500 truncate block">Gabriel Siqueira</span>
              </button>
            </div>
          </div>
        </div>

        {/* Security badge footer */}
        <div className="mt-6 text-center text-xs text-zinc-500 font-mono">
          <span>RLS Enforced · ISO 27001 Aligned · NettosCorp Enterprise</span>
        </div>
      </div>
    </div>
  );
};
