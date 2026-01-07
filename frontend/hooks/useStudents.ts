import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { adminAPI } from '@/lib/api/endpoints';

type StudentsParams = { page?: number; search?: string; classId?: string };

export function useStudents(params: StudentsParams = { page: 1 }) {
  const { page = 1, search, classId } = params;
  const key = ['students', { page, search: search || '', classId: classId || '' }];

  const query = useQuery(key, () => adminAPI.getStudents({ page, search, currentClassLevel: classId }), {
    keepPreviousData: true,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });

  return query;
}

export function useStudent(id?: string, enabled = !!id) {
  return useQuery(['student', id], () => (id ? adminAPI.getStudent(id) : Promise.resolve(null)), { enabled });
}

export function useCreateStudent() {
  const qc = useQueryClient();
  return useMutation((data: any) => adminAPI.createStudent(data), {
    onSuccess: () => qc.invalidateQueries({ queryKey: ['students'] }),
  });
}

export function useUpdateStudent(id?: string) {
  const qc = useQueryClient();
  return useMutation((data: any) => adminAPI.updateStudent(id as string, data), {
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['students'] });
      qc.invalidateQueries({ queryKey: ['student', id] });
    },
  });
}

export function useDeleteStudent() {
  const qc = useQueryClient();
  return useMutation((id: string) => adminAPI.deleteStudent(id), {
    onSuccess: () => qc.invalidateQueries({ queryKey: ['students'] }),
  });
}
