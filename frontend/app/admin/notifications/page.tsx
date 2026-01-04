"use client"

import { useState } from 'react';

export default function NotificationsAdminPage() {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [targetRoles, setTargetRoles] = useState(['admin']);
  const [status, setStatus] = useState('');

  const roles = ['admin', 'teacher', 'student', 'parent'];

  async function handleSend(e: any) {
    e.preventDefault();
    setStatus('Sending...');
    try {
      const res = await fetch('/api/notifications', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ action: 'send', title, message, type: 'info', targetRoles }) });
      const data = await res.json();
      if (res.ok) setStatus('Sent'); else setStatus('Failed: ' + (data.message || res.statusText));
    } catch (err) {
      setStatus('Failed: ' + String(err));
    }
  }

  function toggleRole(r: string) {
    setTargetRoles(prev => prev.includes(r) ? prev.filter(x => x !== r) : [...prev, r]);
  }

  return (
    <div className="max-w-2xl">
      <h2 className="text-lg font-semibold">Send Broadcast</h2>
      <form onSubmit={handleSend} className="space-y-4 mt-4">
        <div>
          <label className="block text-sm font-medium">Title</label>
          <input value={title} onChange={e => setTitle(e.target.value)} className="mt-1 w-full rounded border px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium">Message</label>
          <textarea value={message} onChange={e => setMessage(e.target.value)} className="mt-1 w-full rounded border px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium">Target Roles</label>
          <div className="flex gap-2 mt-2">
            {roles.map(r => (
              <button type="button" key={r} onClick={() => toggleRole(r)} className={`px-3 py-1 rounded ${targetRoles.includes(r) ? 'bg-primary text-white' : 'bg-slate-100'}`}>{r}</button>
            ))}
          </div>
        </div>
        <div>
          <button className="btn btn-primary" type="submit">Send</button>
          <div className="mt-2 text-sm text-muted-foreground">{status}</div>
        </div>
      </form>
    </div>
  )
}
