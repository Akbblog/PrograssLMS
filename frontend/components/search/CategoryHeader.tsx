import React from 'react';

export const CategoryHeader = ({ category, count }: { category: string; count: number }) => (
  <div className="flex items-center justify-between py-1">
    <span className="font-semibold text-xs text-slate-500 uppercase">{category}</span>
    <span className="text-xs text-slate-400">See all {count} →</span>
  </div>
);
