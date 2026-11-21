/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface PageHeaderProps {
  title: string;
  description?: string;
  kicker?: string;
  actions?: React.ReactNode;
  className?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  kicker,
  actions,
  className = '',
}) => {
  return (
    <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-zinc-800 ${className}`}>
      <div>
        {kicker && (
          <span className="text-[11px] font-mono uppercase tracking-wider text-blue-600 block mb-1">
            {kicker}
          </span>
        )}
        <h1 className="text-2xl sm:text-[28px] font-semibold tracking-tight text-zinc-100 font-sans">
          {title}
        </h1>
        {description && (
          <p className="text-sm text-zinc-500 mt-1 max-w-2xl leading-relaxed">
            {description}
          </p>
        )}
      </div>

      {actions && (
        <div className="flex items-center gap-2.5 shrink-0">
          {actions}
        </div>
      )}
    </div>
  );
};
