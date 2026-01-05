import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount)
}

export function formatDate(date: string | Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date))
}

export function unwrapArray<T = any>(payload: any, key?: string): T[] {
  if (Array.isArray(payload)) return payload

  // common Axios shape: { data: [...] }
  if (Array.isArray(payload?.data)) return payload.data

  // explicit key shape: { students: [...] } or { data: { students: [...] } }
  if (key) {
    if (Array.isArray(payload?.[key])) return payload[key]
    if (Array.isArray(payload?.data?.[key])) return payload.data[key]
  }

  // paginated/object shape: { students: [...], total, page, ... }
  if (payload && typeof payload === "object") {
    const arrays = Object.values(payload).filter(Array.isArray) as T[][]
    if (arrays.length === 1) return arrays[0]
  }
  if (payload?.data && typeof payload.data === "object") {
    const arrays = Object.values(payload.data).filter(Array.isArray) as T[][]
    if (arrays.length === 1) return arrays[0]
  }

  return []
}
