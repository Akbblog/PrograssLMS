"use client"

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Send, Bell, Loader2 } from "lucide-react";
import { toast } from "sonner";
import AdminPageLayout from '@/components/layouts/AdminPageLayout';

export default function NotificationsAdminPage() {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [targetRoles, setTargetRoles] = useState<string[]>(['admin']);
  const [sending, setSending] = useState(false);

  const roles = ['admin', 'teacher', 'student', 'parent'];

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    
    if (!title.trim() || !message.trim()) {
      toast.error("Please fill in both title and message");
      return;
    }

    if (targetRoles.length === 0) {
      toast.error("Please select at least one target role");
      return;
    }

    setSending(true);
    try {
      const res = await fetch('/api/notifications', { 
        method: 'POST', 
        headers: { 'content-type': 'application/json' }, 
        body: JSON.stringify({ action: 'send', title, message, type: 'info', targetRoles }) 
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Notification sent successfully!");
        setTitle('');
        setMessage('');
      } else {
        toast.error(data.message || "Failed to send notification");
      }
    } catch (err) {
      toast.error("Failed to send notification");
    } finally {
      setSending(false);
    }
  }

  function toggleRole(r: string) {
    setTargetRoles(prev => prev.includes(r) ? prev.filter(x => x !== r) : [...prev, r]);
  }

  return (
    <AdminPageLayout
      title="Notifications"
      description="Send broadcast notifications to users"
    >
      <div className="max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Send Broadcast
            </CardTitle>
            <CardDescription>
              Create and send notifications to selected user groups
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSend} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input 
                  id="title"
                  value={title} 
                  onChange={e => setTitle(e.target.value)} 
                  placeholder="Enter notification title"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea 
                  id="message"
                  value={message} 
                  onChange={e => setMessage(e.target.value)} 
                  placeholder="Enter notification message"
                  rows={4}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Target Roles</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {roles.map(r => (
                    <button 
                      type="button" 
                      key={r} 
                      onClick={() => toggleRole(r)} 
                      className={`px-4 py-2 rounded-lg font-medium text-sm transition-all capitalize ${
                        targetRoles.includes(r) 
                          ? 'bg-primary text-white shadow-sm' 
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
                {targetRoles.length > 0 && (
                  <p className="text-sm text-muted-foreground mt-2">
                    Sending to: {targetRoles.map(r => r.charAt(0).toUpperCase() + r.slice(1)).join(', ')}
                  </p>
                )}
              </div>

              <div className="flex justify-end pt-4 border-t">
                <Button type="submit" disabled={sending}>
                  {sending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Send Notification
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AdminPageLayout>
  )
}
