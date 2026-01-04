"use client"

import React, { useEffect, useState, useRef } from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

async function fetchNotifications() {
  const res = await fetch('/api/notifications');
  if (!res.ok) throw new Error('Failed');
  return res.json();
}

async function fetchUnreadCount() {
  const res = await fetch('/api/notifications/unread-count');
  if (!res.ok) throw new Error('Failed');
  return res.json();
}

export default function NotificationBell() {
  const [unread, setUnread] = useState(0);
  type NotificationItem = { recipient?: any; notification?: any };
  const [items, setItems] = useState<NotificationItem[]>([]);
  const esRef = useRef<EventSource | null>(null);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const c = await fetchUnreadCount();
        if (mounted) setUnread(c.data.count || 0);
      } catch (err) {
        // ignore
      }

      try {
        const list = await fetchNotifications();
        if (mounted) setItems(list.data || []);
      } catch (err) {
        // ignore
      }
    })();

    // Connect SSE directly to backend
    const backend = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://progresslms-backend.vercel.app/api/v1';
    try {
      const url = `${backend}/communication/notifications/stream`;
      const es = new EventSource(url, { withCredentials: true } as any);
      es.onmessage = (e) => {
        try {
          const payload = JSON.parse(e.data);
          // Received a message that may be a notification event
          if (payload && payload.notification) {
            setItems(prev => [{ recipient: payload.recipient, notification: payload.notification }, ...prev]);
            setUnread(u => u + 1);
          }
        } catch (err) {}
      };
      es.onerror = () => {
        // fallback to polling every 20s if SSE fails
        if (esRef.current) {
          esRef.current.close();
          esRef.current = null;
        }
      };
      esRef.current = es;
    } catch (err) {
      // if SSE fails to initialize, rely on polling
    }

    const poll = setInterval(async () => {
      try {
        const c = await fetchUnreadCount();
        setUnread(c.data.count || 0);
      } catch (err) {}
    }, 20000);

    return () => {
      mounted = false;
      if (esRef.current) esRef.current.close();
      clearInterval(poll);
    };
  }, []);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unread > 0 && (
            <span className="absolute -top-1 -right-1 inline-flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-xs text-white">{unread}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-2">
          <div className="text-sm font-medium">Notifications</div>
          {items.length === 0 && <div className="text-sm text-muted-foreground">No notifications</div>}
          {items.map((it: any, idx: number) => (
            <div key={idx} className={`rounded p-2 ${it.recipient?.readAt ? 'opacity-60' : ''}`}>
              <div className="font-semibold">{it.notification?.title}</div>
              <div className="text-xs text-muted-foreground">{it.notification?.message}</div>
              {it.notification?.actionUrl && <a className="text-primary underline text-xs" href={it.notification.actionUrl}>Open</a>}
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}