"use client"

import React, { useEffect } from 'react'

type Student = {
  _id?: string
  name?: string
  avatar?: string
}

type Props = {
  record: {
    attendanceId?: string
    student?: Student
    classLevel?: { name?: string }
    timestamp?: string | number | Date
    qrScanTimestamp?: string | number | Date
    createdAt?: string | number | Date
    date?: string | number | Date
  }
  onClose?: () => void
}

export default function AttendanceToast({ record, onClose }: Props) {
  useEffect(() => {
    const t = setTimeout(() => onClose && onClose(), 4000)
    return () => clearTimeout(t)
  }, [record, onClose])

  if (!record) return null

  const ts = record.timestamp || record.qrScanTimestamp || record.createdAt || record.date
  const when = ts ? new Date(ts).toLocaleTimeString() : ''

  return (
    <div className="fixed right-6 bottom-6 z-50">
      <div className="max-w-xs bg-white shadow-lg rounded-lg overflow-hidden ring-1 ring-gray-200 animate-slide-in">
        <div className="flex items-center gap-3 p-3">
          <img src={record.student?.avatar || '/images/default-avatar.png'} alt="avatar" className="w-12 h-12 rounded-full object-cover" />
          <div>
            <div className="font-semibold text-sm">{record.student?.name || 'Unknown Student'}</div>
            <div className="text-xs text-gray-500">{record.classLevel?.name || ''} - {when}</div>
          </div>
        </div>
      </div>
      <style jsx>{`
        .animate-slide-in {
          transform: translateY(20px);
          opacity: 0;
          animation: slideIn 300ms forwards ease-out;
        }
        @keyframes slideIn {
          to { transform: translateY(0); opacity: 1 }
        }
      `}</style>
    </div>
  )
}
