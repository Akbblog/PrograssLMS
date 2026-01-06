"use client"

import React from "react"
import BulkCardsForm from "@/components/admin/BulkCardsForm"
import { Card } from "@/components/ui/card"

export default function CardsPage() {
  return (
    <div className="max-w-4xl">
      <div className="mb-4">
        <h1 className="text-2xl font-semibold">ID Cards / Bulk Print</h1>
        <p className="text-sm text-muted-foreground">Generate and download ID cards in bulk. Cards follow the school's branding.</p>
      </div>

      <Card className="p-4">
        <BulkCardsForm />
      </Card>
    </div>
  )
}
