"use client"

import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { toast } from "sonner";

type Props = {
  id: string;
  type: "students" | "teachers" | "staff" | string;
};

export default function ProfileAvatarUploader({ id, type }: Props) {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [qrImage, setQrImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const endpoint = type === 'students' ? `/api/v1/students/${id}` : `/api/v1/staff/teachers/${id}`;
        const res = await fetch(endpoint, { credentials: 'include' });
        if (!res.ok) return;
        const json = await res.json();
        const data = json.data || json.student || json.teacher || json;
        if (data && data.avatar) setAvatarUrl(data.avatar);
      } catch (e) {
        // ignore
      }
    }
    if (id) load();
  }, [id, type]);

  // Select file and show preview; actual upload performed by confirmUpload
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    // basic client-side validations
    if (!file.type.startsWith('image/')) return toast.error('Only image files allowed');
    if (file.size > 5 * 1024 * 1024) return toast.error('Image must be under 5MB');
    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const confirmUpload = async () => {
    if (!selectedFile) return toast.error('No file selected');
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('avatar', selectedFile, selectedFile.name);
      const endpoint = type === 'students' ? `/api/v1/students/${id}/avatar` : `/api/v1/staff/teachers/${id}/avatar`;
      const res = await fetch(endpoint, { method: 'PATCH', body: fd, credentials: 'include' });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || json.error || 'Upload failed');
      const payload = json.data || json;
      const avatar = payload.avatar || (payload.data && payload.data.avatar) || null;
      const qr = payload.qrImage || null;
      if (avatar) setAvatarUrl(avatar);
      if (qr) setQrImage(qr);
      // clear selection and preview
      setSelectedFile(null);
      if (previewUrl) { URL.revokeObjectURL(previewUrl); setPreviewUrl(null); }
      toast.success('Avatar uploaded');
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  const copyLink = async () => {
    if (!avatarUrl) return;
    try {
      await navigator.clipboard.writeText(avatarUrl);
      toast.success('Avatar URL copied');
    } catch (e) {
      toast.error('Failed to copy');
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label>Current Avatar</Label>
        <div className="flex items-center gap-4">
          {avatarUrl ? (
            <img src={avatarUrl} alt="avatar" className="w-24 h-24 rounded-full object-cover border" />
          ) : (
            <div className="w-24 h-24 rounded-full bg-slate-100 flex items-center justify-center border">No avatar</div>
          )}
          <div className="flex flex-col gap-2">
            <input id={`file-input-${id}`} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
            <div className="flex gap-2">
              <Button onClick={() => (document.getElementById(`file-input-${id}`) as HTMLInputElement)?.click()} disabled={loading}>{loading ? 'Uploading...' : (selectedFile ? 'Change file' : 'Choose file')}</Button>
              <Button variant="secondary" onClick={confirmUpload} disabled={!selectedFile || loading}>Upload</Button>
              <Button variant="outline" onClick={copyLink} disabled={!avatarUrl}>Copy link</Button>
            </div>
            {previewUrl && (
              <div className="mt-2">
                <Label>Preview</Label>
                <img src={previewUrl} alt="preview" className="w-24 h-24 rounded-full object-cover border" />
              </div>
            )}
          </div>
        </div>
      </div>

      <div>
        <Label>QR (links to profile/avatar)</Label>
        <div className="flex items-start gap-4">
          {qrImage ? (
            <img src={qrImage} alt="qr" className="w-36 h-36 bg-white p-2 border" />
          ) : (
            <div className="w-36 h-36 bg-slate-50 flex items-center justify-center border">No QR</div>
          )}
          <div className="flex-1">
            <p className="text-sm text-muted-foreground">This QR encodes an encrypted token pointing to the profile/avatar link. You can display or print it separately from the avatar.</p>
            {avatarUrl && (
              <a className="block mt-2 text-primary" href={avatarUrl} target="_blank" rel="noreferrer">Open avatar link</a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
