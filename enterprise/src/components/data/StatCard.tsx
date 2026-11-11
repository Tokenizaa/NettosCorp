/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  subValue?: string;
  trend?: {
    direction: 'up' | 'down' | 'neutral';
    text: string;
  };
  icon?: LucideIcon;
  onClick?: () => void;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  subValue,
  trend,
  icon: Icon,
  onClick,
  className = '',
}) => {
  return (
    <div
      onClick={onClick}
      className={`p-4 bg-zinc-900/80 border border-zinc-800/80 rounded-lg hover:border-zinc-700/80 transition-all ${
        onClick ? 'cursor-pointer hover:bg-zinc-800/40' : ''
      } ${className}`}
    >
      <div className="flex items-center justify-between text-zinc-400 mb-2">
        <span className="text-xs font-medium tracking-wide uppercase">{label}</span>
        {Icon && <Icon className="w-4 h-4 text-zinc-500" />}
      </div>

      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-bold tracking-tight text-zinc-100 font-mono tabular-nums">
          {value}
        </span>
        {subValue && (
          <span className="text-xs text-zinc-500 font-normal">
            {subValue}
          </span>
        )}
      </div>

      {trend && (
        <div className="mt-2 text-xs flex items-center gap-1.5 text-zinc-400 font-mono">
          <span
            className={
              trend.direction === 'up'
                ? 'text-emerald-400'
                : trend.direction === 'down'
                ? 'text-rose-400'
                : 'text-zinc-400'
            }
          >
            {trend.direction === 'up' ? '↑' : trend.direction === 'down' ? '↓' : '·'}
          </span>
          <span>{trend.text}</span>
        </div>
      )}
    </div>
  );
};
