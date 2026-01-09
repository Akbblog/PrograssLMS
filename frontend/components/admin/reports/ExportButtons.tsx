'use client';

import * as React from 'react';
import { Button } from '@/app/components/ui/button';
import { downloadCsv } from './exporters';
import { pdf } from '@react-pdf/renderer';
import { downloadBlob } from './exporters';
import { ReportPdfDocument, ReportPdfKpi } from './ReportPdfDocument';

export function ExportButtons({
  title,
  csvRows,
  pdf,
}: {
  title: string;
  csvRows: Record<string, unknown>[];
  pdf?: { kpis?: ReportPdfKpi[]; table?: { headers: string[]; rows: Array<Array<string | number>>; title?: string } };
}) {
  const onCsv = React.useCallback(() => {
    downloadCsv(csvRows, `${title}.csv`);
  }, [csvRows, title]);

  const onPdf = React.useCallback(async () => {
    const doc = <ReportPdfDocument title={title} kpis={pdf?.kpis} table={pdf?.table} />;
    const blob = await pdfRenderer(doc);
    downloadBlob(blob, `${title}.pdf`);
  }, [pdf, title]);

  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" onClick={onCsv} disabled={csvRows.length === 0}>
        Export CSV
      </Button>
      <Button variant="outline" onClick={onPdf} disabled={!pdf}>
        Export PDF
      </Button>
    </div>
  );
}

async function pdfRenderer(doc: React.ReactElement) {
  const instance = pdf(doc);
  return instance.toBlob();
}
