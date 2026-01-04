import React from 'react'
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer'

const styles = StyleSheet.create({ page: { padding: 20 }, header: { fontSize: 18, fontWeight: 'bold' }, section: { marginTop: 10 } });

export default function FeeVoucherTemplate({ student, fee }: { student?: any, fee?: any }){
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