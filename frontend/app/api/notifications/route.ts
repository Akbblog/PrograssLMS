import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';

async function proxy(req: NextRequest, path = '') {
  const url = `${BACKEND_URL}/api/v1/communication/notifications${path}`;
  const headers = new Headers();
  // forward auth header
  const auth = req.headers.get('authorization');
  if (auth) headers.set('authorization', auth);
  // other headers as needed

  const init: RequestInit = {
    method: req.method,
    headers,
    body: req.method !== 'GET' && req.method !== 'HEAD' ? await req.text() : undefined,
  };

  const res = await fetch(url, init);
  const data = await res.text();
  return new NextResponse(data, { status: res.status, headers: { 'content-type': res.headers.get('content-type') || 'application/json' } });
}

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const q = url.search;
  return proxy(request, q);
}

export async function POST(request: NextRequest) {
  // Path-based actions: /mark-read, /mark-all-read, /send
  // We rely on body.action to determine
  const body = await request.json().catch(() => ({}));
  const action = body.action || '';
  const path = action ? `/${action}` : '';
  // Recreate request with same body for backend
  return proxy(request, path);
}

export async function PUT(request: NextRequest) {
  return proxy(request);
}

export async function PATCH(request: NextRequest) {
  return proxy(request);
}

export async function DELETE(request: NextRequest) {
  return proxy(request);
}