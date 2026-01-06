"use client"

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import AdminPageLayout from '@/components/layouts/AdminPageLayout'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import ProfileAvatarUploader from '@/components/admin/ProfileAvatarUploader'
import { adminAPI } from '@/lib/api/endpoints'

export default function TeacherProfilePage({ params }: { params: { id: string } }) {
  const id = params.id
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')

  useEffect(() => {
    let mounted = true
    async function load() {
      try {
        const res: any = await adminAPI.getTeachers()
        // try to fetch single teacher via getTeachers (fallback) or dedicated endpoint
        let data = null
        try {
          const single: any = await adminAPI.getTeachers({ id })
          data = single.data || single
        } catch (e) {
          // fallback to list
          const list: any = await adminAPI.getTeachers()
          const arr = list.data && list.data.teachers ? list.data.teachers : list
          data = arr.find((t: any) => (t._id || t.id) === id) || null
        }
        if (!mounted) return
        setName(data?.name || '')
        setEmail(data?.email || '')
      } catch (e) {
        console.warn('Failed to load teacher', e)
        toast.error('Failed to load teacher')
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [id])

  const validate = () => {
    if (!name || name.trim().length < 2) return 'Name is required (min 2 chars)'
    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return 'Valid email is required'
    return null
  }

  const handleSave = async () => {
    const err = validate()
    if (err) return toast.error(err)
    setSaving(true)
    try {
      await adminAPI.updateTeacher(id, { name, email })
      toast.success('Profile updated')
      router.refresh()
    } catch (e: any) {
      console.error(e)
      toast.error(e?.message || 'Update failed')
    } finally {
      setSaving(false)
    }
  }

  return (
    <AdminPageLayout title="Teacher Profile" description="Edit teacher profile and avatar">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <ProfileAvatarUploader id={id} type="teachers" />
        </div>
        <div className="md:col-span-2">
          <div className="space-y-4">
            <div>
              <Label>Name</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div>
              <Label>Email</Label>
              <Input value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</Button>
              <Button variant="ghost" onClick={() => router.back()}>Cancel</Button>
            </div>
          </div>
        </div>
      </div>
    </AdminPageLayout>
  )
}
