"use client"

import React, { useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';

export default function VirtualizedList<T>({
  items,
  estimateSize = 120,
  renderItem,
  containerClassName = ''
}: {
  items: T[];
  estimateSize?: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  containerClassName?: string;
}) {
  const parentRef = useRef<HTMLDivElement | null>(null);

  const rowVirtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => estimateSize,
    overscan: 6,
  });

  return (
    <div ref={parentRef} className={`h-[70vh] overflow-auto ${containerClassName}`}>
      <div style={{ height: `${rowVirtualizer.getTotalSize()}px`, position: 'relative' }}>
        {rowVirtualizer.getVirtualItems().map(virtualRow => {
          const item = items[virtualRow.index];
          return (
            <div
              key={virtualRow.key}
              data-index={virtualRow.index}
              ref={virtualRow.measureElement}
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', transform: `translateY(${virtualRow.start}px)` }}
            >
              {renderItem(item, virtualRow.index)}
            </div>
          );
        })}
      </div>
    </div>
  );
}
