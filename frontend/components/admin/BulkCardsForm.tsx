"use client"

import React, { useState } from "react"
import { Button } from "../ui/button"
import { Select } from "../ui/select"
import { Label } from "../ui/label"
import { toast } from "sonner"
import PaginatedUserPicker from "@/components/admin/PaginatedUserPicker"
import { Dialog } from "@/components/ui/dialog"
import { adminAPI } from "@/lib/api/endpoints"

export default function BulkCardsForm({}) {
  const [ids, setIds] = useState("")
  const [type, setType] = useState("students")
  const [loading, setLoading] = useState(false)
  const [pickerOpen, setPickerOpen] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const arr = ids.split(/[,\n\s]+/).filter(Boolean)
    if (arr.length === 0) return toast.error("Provide at least one id")
    setLoading(true)
    try {
      const res = await adminAPI.bulkDownloadCards({ ids: arr, type })
      const blob: Blob = (res as any)?.data ?? (res as any)
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `cards-${type}-${Date.now()}.zip`
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
      toast.success("Download started")
    } catch (err) {
      console.error(err)
      toast.error("Failed to download cards")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label>Type</Label>
        <Select value={type} onValueChange={(v: string) => setType(v)}>
          <option value="students">Students</option>
          <option value="staff">Staff</option>
        </Select>
      </div>

      <div>
        <Label>IDs (comma, space or newline separated)</Label>
        <textarea
          rows={6}
          value={ids}
          onChange={(e) => setIds((e.target as HTMLTextAreaElement).value)}
          className="file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-slate-900/50 border-slate-200 dark:border-slate-700 w-full min-w-0 rounded-lg border bg-transparent px-3 py-2 text-base shadow-sm transition-all duration-200 outline-none md:text-sm"
        />
      </div>

      <div className="flex gap-2">
        <Button type="submit" disabled={loading}>{loading ? 'Preparing...' : 'Download ZIP'}</Button>
        <Button variant="outline" type="button" onClick={() => setIds('')}>Clear</Button>
        <Button variant="ghost" type="button" onClick={() => setPickerOpen(true)}>Pick users</Button>
      </div>

      <Dialog open={pickerOpen} onOpenChange={setPickerOpen}>
        <PaginatedUserPicker open={pickerOpen} onClose={() => setPickerOpen(false)} onConfirm={(selected: string[]) => setIds(prev => (prev ? prev + '\n' : '') + selected.join('\n'))} type={type} />
      </Dialog>
    </form>
  )
}
