'use client';

import * as React from 'react';
import { LuminaCard, LuminaCardContent, LuminaCardHeader, LuminaCardTitle } from '@/components/ui/lumina-card';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { MoreVertical, Download, Maximize2, Share2, BarChart3 } from 'lucide-react';

interface ChartCardProps {
  title: string;
  children: React.ReactNode;
  loading?: boolean;
  empty?: boolean;
  emptyMessage?: string;
  onExport?: () => void;
  onFullscreen?: () => void;
  className?: string;
  headerActions?: React.ReactNode;
}

export function ChartCard({
  title,
  children,
  loading = false,
  empty = false,
  emptyMessage = 'No data available',
  onExport,
  onFullscreen,
  className,
  headerActions,
}: ChartCardProps) {
  const showActions = onExport || onFullscreen || headerActions;

  if (loading) {
    return (
      <LuminaCard variant="default" className={cn('border-none shadow-card', className)}>
        <LuminaCardHeader className="flex flex-row items-center justify-between pb-2 border-b border-border/50">
          <div className="h-5 w-32 bg-muted animate-pulse rounded" />
          <div className="h-8 w-8 bg-muted animate-pulse rounded-lg" />
        </LuminaCardHeader>
        <LuminaCardContent className="h-[320px] flex items-center justify-center">
          <div className="space-y-3 w-full">
            <div className="h-4 w-full bg-muted animate-pulse rounded" />
            <div className="h-48 w-full bg-muted/50 animate-pulse rounded-lg" />
            <div className="flex justify-center gap-4">
              <div className="h-3 w-16 bg-muted animate-pulse rounded" />
              <div className="h-3 w-16 bg-muted animate-pulse rounded" />
            </div>
          </div>
        </LuminaCardContent>
      </LuminaCard>
    );
  }

  return (
    <LuminaCard
      variant="default"
      className={cn('border-none shadow-card hover:shadow-card-hover transition-all duration-300', className)}
    >
      <LuminaCardHeader className="flex flex-row items-center justify-between pb-3 border-b border-border/50">
        <LuminaCardTitle className="text-base font-bold flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-primary" />
          {title}
        </LuminaCardTitle>
        {showActions && (
          <div className="flex items-center gap-1">
            {headerActions}
            {(onExport || onFullscreen) && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
                    <MoreVertical className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                  {onExport && (
                    <DropdownMenuItem onClick={onExport} className="cursor-pointer">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </DropdownMenuItem>
                  )}
                  {onFullscreen && (
                    <DropdownMenuItem onClick={onFullscreen} className="cursor-pointer">
                      <Maximize2 className="w-4 h-4 mr-2" />
                      Fullscreen
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        )}
      </LuminaCardHeader>
      <LuminaCardContent className="h-[320px] min-h-[320px] w-full min-w-0 pt-4">
        {empty ? (
          <div className="h-full w-full flex flex-col items-center justify-center text-muted-foreground">
            <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mb-4">
              <BarChart3 className="w-8 h-8 text-muted-foreground/50" />
            </div>
            <p className="text-sm font-medium">{emptyMessage}</p>
            <p className="text-xs mt-1">Try adjusting your date range or filters</p>
          </div>
        ) : (
          <div className="h-full w-full min-w-0">{children}</div>
        )}
      </LuminaCardContent>
    </LuminaCard>
  );
}
