"use client"

import React from 'react'

type Student = {
  _id?: string
  name?: string
  avatar?: string
}

type Record = {
  _id?: string
  attendanceId?: string
  student?: Student
  classLevel?: { name?: string }
  status?: string
  timestamp?: string | number | Date
}

type Props = {
  records: Record[]
}

export default function LiveAttendanceFeed({ records }: Props) {
  return (
    <div className="bg-white shadow rounded p-4 max-h-[420px] overflow-y-auto">
      <div className="space-y-3">
        {records?.length === 0 && (
          <div className="text-gray-500 text-sm">No recent scans</div>
        )}

        {records?.map((r) => {
          const ts = r.timestamp || r.qrScanTimestamp || r.createdAt || r.date;
          const time = ts ? new Date(ts).toLocaleTimeString() : ''
          return (
            <div key={r._id || r.attendanceId} className="flex items-center gap-3 p-2 rounded hover:bg-gray-50">
              <img src={r.student?.avatar || '/images/default-avatar.png'} alt="avatar" className="w-10 h-10 rounded-full object-cover" />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium">{r.student?.name || 'Unknown Student'}</div>
                  <div className="text-xs text-gray-400">{time}</div>
                </div>
                <div className="text-xs text-gray-500">{r.classLevel?.name || ''}</div>
              </div>
              <div>
                <span className={`text-xs px-2 py-1 rounded ${r.status === 'present' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                  {r.status || 'present'}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
