'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { downloadCsv } from './exporters';
import { pdf, type DocumentProps } from '@react-pdf/renderer';
import { downloadBlob } from './exporters';
import { ReportPdfDocument, ReportPdfKpi } from './ReportPdfDocument';
import { toast } from 'sonner';
import { Download, FileSpreadsheet, FileText, ChevronDown, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export function ExportButtons({
  title,
  csvRows,
  pdf: pdfData,
  className,
}: {
  title: string;
  csvRows: Record<string, unknown>[];
  pdf?: { kpis?: ReportPdfKpi[]; table?: { headers: string[]; rows: Array<Array<string | number>>; title?: string } };
  className?: string;
}) {
  const [exportingCsv, setExportingCsv] = React.useState(false);
  const [exportingPdf, setExportingPdf] = React.useState(false);

  const recordCount = csvRows.length;

  const onCsv = React.useCallback(async () => {
    setExportingCsv(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 300)); // Brief delay for UX
      downloadCsv(csvRows, `${title}.csv`);
      toast.success('CSV exported successfully', {
        description: `${recordCount} record${recordCount !== 1 ? 's' : ''} exported`,
      });
    } catch (error) {
      toast.error('Failed to export CSV');
    } finally {
      setExportingCsv(false);
    }
  }, [csvRows, title, recordCount]);

  const onPdf = React.useCallback(async () => {
    setExportingPdf(true);
    try {
      const doc = <ReportPdfDocument title={title} kpis={pdfData?.kpis} table={pdfData?.table} />;
      const blob = await pdfRenderer(doc);
      downloadBlob(blob, `${title}.pdf`);
      toast.success('PDF exported successfully', {
        description: 'Report generated and downloaded',
      });
    } catch (error) {
      toast.error('Failed to export PDF');
    } finally {
      setExportingPdf(false);
    }
  }, [pdfData, title]);

  const isLoading = exportingCsv || exportingPdf;
  const hasData = csvRows.length > 0 || pdfData;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          disabled={!hasData || isLoading}
          className={cn(
            'gap-2 rounded-lg border-border hover:bg-primary/5 hover:border-primary/20 transition-all',
            className
          )}
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Download className="w-4 h-4" />
          )}
          Export
          {recordCount > 0 && (
            <Badge variant="secondary" className="ml-1 px-1.5 py-0 text-[10px] font-semibold">
              {recordCount}
            </Badge>
          )}
          <ChevronDown className="w-3 h-3 ml-1 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuItem
          onClick={onCsv}
          disabled={csvRows.length === 0 || exportingCsv}
          className="cursor-pointer"
        >
          {exportingCsv ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <FileSpreadsheet className="w-4 h-4 mr-2 text-success" />
          )}
          Export as CSV
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={onPdf}
          disabled={!pdfData || exportingPdf}
          className="cursor-pointer"
        >
          {exportingPdf ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <FileText className="w-4 h-4 mr-2 text-destructive" />
          )}
          Export as PDF
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

async function pdfRenderer(doc: React.ReactElement) {
  // `pdf()`'s types expect a <Document /> element, but common usage passes a component that renders <Document />.
  // Cast to satisfy TypeScript while preserving runtime behavior.
  const instance = pdf(doc as unknown as React.ReactElement<DocumentProps>);
  return instance.toBlob();
}
