import React, { useEffect, useState } from 'react'

export default function FeeVoucherTemplate({ student, fee }: { student?: any, fee?: any }){
  const [components, setComponents] = useState<any>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const mod = await import('@react-pdf/renderer');
      if (!mounted) return;
      setComponents({ Document: mod.Document, Page: mod.Page, Text: mod.Text, View: mod.View, StyleSheet: mod.StyleSheet });
    })();
    return () => { mounted = false };
  }, []);

  if (!components) {
    return (
      <div className="p-6 bg-slate-50 rounded">
        <div className="animate-pulse h-6 w-2/5 bg-slate-200 mb-3"></div>
        <div className="animate-pulse h-4 w-3/5 bg-slate-200"></div>
      </div>
    );
  }

  const { Document, Page, Text, View, StyleSheet } = components;
  const styles = StyleSheet.create({ page: { padding: 20 }, header: { fontSize: 18, fontWeight: 'bold' }, section: { marginTop: 10 } });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View>
          <Text style={styles.header}>Fee Voucher</Text>
          <Text style={styles.section}>Student: {student?.name || 'N/A'}</Text>
          <Text style={styles.section}>Amount: {fee?.amount || 'N/A'}</Text>
        </View>
      </Page>
    </Document>
  )
}