"use client"

import { useEffect } from 'react'
import { useSearchStore } from '../../store/searchStore'

export default function GlobalSearchActivator() {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        useSearchStore.getState().open()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  return null
}