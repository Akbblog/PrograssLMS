"use client"

import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, Clock, User } from 'lucide-react'

export interface AttendanceEvent {
  id: string
  studentName: string
  studentId?: string
  avatar?: string
  classLevel?: string
  timestamp: Date | string
}

interface AttendanceToastProps {
  event: AttendanceEvent | null
  onClose: () => void
}

export default function AttendanceToast({ event, onClose }: AttendanceToastProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (event) {
      setIsVisible(true)
      const timer = setTimeout(() => {
        setIsVisible(false)
        setTimeout(onClose, 300)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [event, onClose])

  const getInitial = (name: string) => {
    return name?.charAt(0)?.toUpperCase() || 'S'
  }

  const formatTime = (date: Date | string) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
  }

  return (
    <AnimatePresence>
      {isVisible && event && (
        <motion.div
          initial={{ opacity: 0, y: -100, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.9 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="fixed top-20 right-6 z-[60]"
        >
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500 via-green-500 to-teal-600 p-1 shadow-2xl">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              initial={{ x: '-100%' }}
              animate={{ x: '100%' }}
              transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 3 }}
            />
            
            <div className="relative flex items-center gap-4 rounded-xl bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm px-5 py-4 min-w-[320px]">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 400 }}
                className="relative"
              >
                {event.avatar ? (
                  <img
                    src={event.avatar}
                    alt={event.studentName}
                    className="w-14 h-14 rounded-full object-cover border-3 border-emerald-400 shadow-lg"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-bold text-xl shadow-lg border-3 border-white">
                    {getInitial(event.studentName)}
                  </div>
                )}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.4, type: 'spring' }}
                  className="absolute -bottom-1 -right-1 bg-emerald-500 rounded-full p-1 shadow-md"
                >
                  <CheckCircle2 className="w-4 h-4 text-white" />
                </motion.div>
              </motion.div>

              <div className="flex-1 min-w-0">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1">
                    ✓ Just Checked In
                  </p>
                  <p className="font-bold text-gray-900 dark:text-white text-lg truncate">
                    {event.studentName}
                  </p>
                  <div className="flex items-center gap-3 mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {event.classLevel && (
                      <span className="flex items-center gap-1">
                        <User className="w-3.5 h-3.5" />
                        {event.classLevel}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {formatTime(event.timestamp)}
                    </span>
                  </div>
                </motion.div>
              </div>

              <button
                onClick={() => {
                  setIsVisible(false)
                  setTimeout(onClose, 300)
                }}
                className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <span className="sr-only">Close</span>
                <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
