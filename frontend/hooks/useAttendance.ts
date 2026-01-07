import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { attendanceAPI } from '@/lib/api/endpoints';

export function useAttendanceByDate(classLevel?: string, date?: string, enabled = !!(classLevel && date)) {
  return useQuery(['attendance', { classLevel, date }], () => attendanceAPI.getAttendance(classLevel as string, date as string), { enabled });
}

export function useStudentsForAttendance(classLevel?: string, enabled = !!classLevel) {
  return useQuery(['attendanceStudents', classLevel], () => attendanceAPI.getStudentsForAttendance(classLevel as string), { enabled });
}

export function useMarkAttendance() {
  const qc = useQueryClient();
  return useMutation((data: any) => attendanceAPI.markAttendance(data), {
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['attendance'] });
      qc.invalidateQueries({ queryKey: ['attendanceStudents'] });
    },
  });
}