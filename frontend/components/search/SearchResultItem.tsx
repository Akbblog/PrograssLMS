import React from 'react';
import clsx from 'clsx';

export const SearchResultItem = ({ result, selected }: { result: any; selected: boolean }) => {
  return (
    <div
      className={clsx(
        'flex items-center gap-3 px-3 py-2 rounded cursor-pointer',
        selected ? 'bg-blue-50 border-l-4 border-blue-500' : 'hover:bg-slate-100'
      )}
    >
      <span className="w-8 h-8 flex items-center justify-center rounded bg-slate-200 mr-2">
        {/* TODO: Render icon based on result.icon */}
        {result.icon || '🔍'}
      </span>
      <div className="flex-1">
        <div className="font-medium text-sm">{result.title}</div>
        {result.subtitle && <div className="text-xs text-slate-400">{result.subtitle}</div>}
      </div>
      {result.badge && (
        <span className="ml-2 px-2 py-0.5 rounded text-xs" style={{ background: result.badgeColor || '#eee' }}>
          {result.badge}
        </span>
      )}
    </div>
  );
};
