'use client';

import * as React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { padding: 24, fontSize: 11 },
  title: { fontSize: 18, marginBottom: 12 },
  sectionTitle: { fontSize: 12, marginTop: 14, marginBottom: 6 },
  kpiRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  kpi: { padding: 8, border: '1pt solid #ccc', borderRadius: 4, minWidth: 160 },
  kpiLabel: { fontSize: 9, color: '#666' },
  kpiValue: { fontSize: 14, marginTop: 2 },
  table: { border: '1pt solid #ddd' },
  tr: { flexDirection: 'row' },
  th: { flex: 1, padding: 6, backgroundColor: '#f3f3f3', borderRight: '1pt solid #ddd' },
  td: { flex: 1, padding: 6, borderTop: '1pt solid #eee', borderRight: '1pt solid #eee' },
});

export type ReportPdfKpi = { label: string; value: string };

export function ReportPdfDocument({
  title,
  kpis,
  table,
}: {
  title: string;
  kpis?: ReportPdfKpi[];
  table?: { headers: string[]; rows: Array<Array<string | number>>; title?: string };
}) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>{title}</Text>

        {kpis && kpis.length ? (
          <>
            <Text style={styles.sectionTitle}>Key metrics</Text>
            <View style={styles.kpiRow}>
              {kpis.map((k) => (
                <View key={k.label} style={styles.kpi}>
                  <Text style={styles.kpiLabel}>{k.label}</Text>
                  <Text style={styles.kpiValue}>{k.value}</Text>
                </View>
              ))}
            </View>
          </>
        ) : null}

        {table ? (
          <>
            <Text style={styles.sectionTitle}>{table.title || 'Details'}</Text>
            <View style={styles.table}>
              <View style={styles.tr}>
                {table.headers.map((h) => (
                  <Text key={h} style={styles.th}>
                    {h}
                  </Text>
                ))}
              </View>
              {table.rows.map((r, idx) => (
                <View key={idx} style={styles.tr}>
                  {r.map((cell, cIdx) => (
                    <Text key={cIdx} style={styles.td}>
                      {String(cell)}
                    </Text>
                  ))}
                </View>
              ))}
            </View>
          </>
        ) : null}
      </Page>
    </Document>
  );
}
