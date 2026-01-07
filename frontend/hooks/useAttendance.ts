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
  type MarkPayload = {
    classLevel: string;
    date: string;
    academicYear: string;
    academicTerm: string;
    records: Array<{ student: string; status: 'present' | 'absent'; remarks?: string }>;
  };

  const m = useMutation<any, Error, MarkPayload>((data: MarkPayload) => attendanceAPI.markAttendance(data), {
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['attendance'] });
      qc.invalidateQueries({ queryKey: ['attendanceStudents'] });
    },
  });

  return {
    mutateAsync: m.mutateAsync,
    mutate: m.mutate,
    isLoading: (m as any).isLoading ?? m.status === 'loading',
    reset: m.reset,
    mutation: m,
  };
}