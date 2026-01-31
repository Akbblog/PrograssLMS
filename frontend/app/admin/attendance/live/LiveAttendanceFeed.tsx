"use client"

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, Clock, User, UserCheck, Loader2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'

interface LiveAttendanceFeedProps {
  records: any[]
  isLoading?: boolean
}

export default function LiveAttendanceFeed({ records, isLoading }: LiveAttendanceFeedProps) {
  const getInitial = (name: string) => {
    return name?.charAt(0)?.toUpperCase() || 'S'
  }

  const formatTime = (date: Date | string) => {
    if (!date) return ''
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'present':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
            <CheckCircle2 className="w-3 h-3" />
            Present
          </span>
        )
      case 'late':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
            <Clock className="w-3 h-3" />
            Late
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400">
            {status || 'Present'}
          </span>
        )
    }
  }

  const getStudentName = (record: any) => {
    if (typeof record.student === 'object' && record.student?.name) {
      return record.student.name
    }
    return 'Unknown Student'
  }

  const getStudentId = (record: any) => {
    if (typeof record.student === 'object' && record.student?.studentId) {
      return record.student.studentId
    }
    if (typeof record.student === 'string') {
      return record.student.slice(-6)
    }
    return null
  }

  const getClassLevel = (record: any) => {
    if (record.classLevel?.name) return record.classLevel.name
    if (typeof record.classLevel === 'string') return record.classLevel
    if (record.student?.currentClassLevel) return record.student.currentClassLevel
    return null
  }

  return (
    <Card className="overflow-hidden border-0 shadow-lg bg-white dark:bg-gray-900">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <UserCheck className="w-5 h-5" />
            Live Check-ins
          </CardTitle>
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            <span className="text-sm text-white/80">Live</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          </div>
        ) : records.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
              <UserCheck className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500 dark:text-gray-400 font-medium">No check-ins yet</p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
              Student check-ins will appear here in real-time
            </p>
          </div>
        ) : (
          <ScrollArea className="h-[400px]">
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              <AnimatePresence initial={false}>
                {records.map((record, index) => {
                  const studentName = getStudentName(record)
                  const studentId = getStudentId(record)
                  const classLevel = getClassLevel(record)
                  const avatar = record.student?.avatar

                  return (
                    <motion.div
                      key={record._id || record.attendanceId || index}
                      initial={{ opacity: 0, x: -20, backgroundColor: 'rgba(16, 185, 129, 0.1)' }}
                      animate={{ opacity: 1, x: 0, backgroundColor: 'transparent' }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{
                        duration: 0.3,
                        delay: index * 0.03,
                        backgroundColor: { duration: 2 }
                      }}
                      className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                    >
                      <div className="relative flex-shrink-0">
                        {avatar ? (
                          <img
                            src={avatar}
                            alt={studentName}
                            className="w-11 h-11 rounded-full object-cover border-2 border-gray-200 dark:border-gray-700"
                          />
                        ) : (
                          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold text-sm">
                            {getInitial(studentName)}
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 dark:text-white truncate">
                          {studentName}
                        </p>
                        <div className="flex items-center gap-3 mt-1 text-sm text-gray-500 dark:text-gray-400">
                          {classLevel && (
                            <span className="flex items-center gap-1">
                              <User className="w-3.5 h-3.5" />
                              {classLevel}
                            </span>
                          )}
                          {studentId && (
                            <span className="text-xs text-gray-400 dark:text-gray-500">
                              #{studentId}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-1.5">
                        {getStatusBadge(record.status)}
                        <span className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatTime(record.qrScanTimestamp || record.timestamp || record.createdAt || record.date)}
                        </span>
                      </div>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  )
}
