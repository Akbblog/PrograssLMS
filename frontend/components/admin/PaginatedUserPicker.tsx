"use client"

import React, { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Table } from "@/components/ui/table"
import { Input } from "@/components/ui/input"

export default function PaginatedUserPicker({ open, onClose, onConfirm, type = 'students' }: { open: boolean; onClose: ()=>void; onConfirm: (ids: string[])=>void; type?: string }) {
  const [page, setPage] = useState<number>(1)
  const [items, setItems] = useState<any[]>([])
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => { fetchPage(1) }, [type])

  async function fetchPage(p: number) {
    setLoading(true)
    try {
      const res = await fetch(`/api/v1/${type}?page=${p}&limit=10`, { credentials: 'include' })
      if (!res.ok) { setItems([]); return }
      const json = await res.json()
      const list = json?.data?.students || json?.data?.teachers || json?.students || []
      setItems(list)
      setPage(p)
    } catch (e) {
      console.error(e)
    } finally { setLoading(false) }
  }

  function toggle(id: string) {
    const s = new Set(selected)
    if (s.has(id)) s.delete(id); else s.add(id)
    setSelected(s)
  }

  return (
    <Dialog open={open} onOpenChange={(v)=>{ if(!v) onClose(); }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select {type}</DialogTitle>
        </DialogHeader>
        <div className="p-4">
          <div className="space-y-2">
            {loading ? <div>Loading...</div> : (
              <div className="grid gap-2">
                {items.map(it => (
                  <label key={it.id || it._id} className="flex items-center gap-2">
                    <input type="checkbox" checked={selected.has(it.id || it._id)} onChange={()=>toggle(it.id || it._id)} />
                    <div>{it.name} <span className="text-sm text-muted-foreground">{it.email}</span></div>
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>
        <DialogFooter>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={()=>fetchPage(Math.max(1, page-1))}>Prev</Button>
            <Button variant="outline" onClick={()=>fetchPage(page+1)}>Next</Button>
            <div className="flex-1" />
            <Button onClick={()=>{ onConfirm(Array.from(selected)); onClose(); }}>Add Selected</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
