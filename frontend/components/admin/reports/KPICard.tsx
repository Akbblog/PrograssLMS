'use client';

import * as React from 'react';
import { LuminaCard, LuminaCardContent } from '@/components/ui/lumina-card';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, Minus, LucideIcon } from 'lucide-react';

export type KPITrend = {
  value: number;
  direction: 'up' | 'down' | 'neutral';
};

export type KPIVariant = 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger';

interface KPICardProps {
  title: string;
  value: React.ReactNode;
  subtitle?: string;
  icon?: LucideIcon;
  trend?: KPITrend;
  variant?: KPIVariant;
  loading?: boolean;
  className?: string;
}

const variantStyles: Record<KPIVariant, string> = {
  default: 'bg-card border border-border',
  primary: 'bg-primary/5 border border-primary/10',
  secondary: 'bg-secondary/5 border border-secondary/10',
  success: 'bg-success/5 border border-success/10',
  warning: 'bg-warning/5 border border-warning/10',
  danger: 'bg-destructive/5 border border-destructive/10',
};

const iconVariantStyles: Record<KPIVariant, string> = {
  default: 'bg-muted text-foreground',
  primary: 'bg-primary/10 text-primary',
  secondary: 'bg-secondary/10 text-secondary',
  success: 'bg-success/10 text-success',
  warning: 'bg-warning/10 text-warning',
  danger: 'bg-destructive/10 text-destructive',
};

export function KPICard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  variant = 'default',
  loading = false,
  className,
}: KPICardProps) {
  const TrendIcon = trend?.direction === 'up' ? TrendingUp : trend?.direction === 'down' ? TrendingDown : Minus;

  if (loading) {
    return (
      <LuminaCard variant="default" className={cn('border-none shadow-card', className)}>
        <LuminaCardContent className="p-5">
          <div className="flex items-start justify-between">
            <div className="space-y-3 flex-1">
              <div className="h-3 w-20 bg-muted animate-pulse rounded" />
              <div className="h-8 w-24 bg-muted animate-pulse rounded" />
              <div className="h-3 w-16 bg-muted animate-pulse rounded" />
            </div>
            <div className="h-11 w-11 bg-muted animate-pulse rounded-xl" />
          </div>
        </LuminaCardContent>
      </LuminaCard>
    );
  }

  return (
    <LuminaCard
      variant="default"
      className={cn(
        'border-none shadow-card hover:shadow-card-hover transition-all duration-300',
        variantStyles[variant],
        className
      )}
    >
      <LuminaCardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="space-y-1 min-w-0 flex-1">
            <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              {title}
            </p>
            <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground truncate">
              {value}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              {trend && (
                <span
                  className={cn(
                    'inline-flex items-center gap-1 text-xs font-medium',
                    trend.direction === 'up' && 'text-success',
                    trend.direction === 'down' && 'text-destructive',
                    trend.direction === 'neutral' && 'text-muted-foreground'
                  )}
                >
                  <TrendIcon className="w-3 h-3" />
                  {trend.value > 0 ? '+' : ''}{trend.value}%
                </span>
              )}
              {subtitle && (
                <span className="text-xs text-muted-foreground truncate">{subtitle}</span>
              )}
            </div>
          </div>
          {Icon && (
            <div
              className={cn(
                'h-11 w-11 rounded-xl flex items-center justify-center flex-shrink-0 backdrop-blur-md',
                iconVariantStyles[variant]
              )}
            >
              <Icon className="h-5 w-5" />
            </div>
          )}
        </div>
      </LuminaCardContent>
    </LuminaCard>
  );
}
