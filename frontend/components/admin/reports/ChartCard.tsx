'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';

export function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent className="h-[320px]">{children}</CardContent>
    </Card>
  );
}
