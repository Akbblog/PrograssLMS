'use client';

import * as React from 'react';

export type DateRangeValue = {
  startDate?: string;
  endDate?: string;
};

export function DateRangePicker({
  value,
  onChange,
}: {
  value: DateRangeValue;
  onChange: (next: DateRangeValue) => void;
}) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
      <div className="flex flex-col gap-1">
        <label className="text-sm text-muted-foreground">Start date</label>
        <input
          type="date"
          className="h-10 rounded-md border bg-background px-3 text-sm"
          value={value.startDate || ''}
          onChange={(e) => onChange({ ...value, startDate: e.target.value || undefined })}
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-sm text-muted-foreground">End date</label>
        <input
          type="date"
          className="h-10 rounded-md border bg-background px-3 text-sm"
          value={value.endDate || ''}
          onChange={(e) => onChange({ ...value, endDate: e.target.value || undefined })}
        />
      </div>
    </div>
  );
}
