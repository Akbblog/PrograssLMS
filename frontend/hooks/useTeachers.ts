import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { adminAPI } from '@/lib/api/endpoints';

export function useTeachers(params: { page?: number; search?: string } = { page: 1 }) {
  const { page = 1, search } = params;
  const key = ['teachers', { page, search: search || '' }];
  return useQuery(key, () => adminAPI.getTeachers({ page, search }), {
    keepPreviousData: true,
    staleTime: 1000 * 60 * 2,
  });
}

export function useTeacher(id?: string, enabled = !!id) {
  return useQuery(['teacher', id], () => (id ? adminAPI.getTeachers({ id }) : Promise.resolve(null)), { enabled });
}

export function useCreateTeacher() {
  const qc = useQueryClient();
  return useMutation((data: any) => adminAPI.createTeacher(data), {
    onSuccess: () => qc.invalidateQueries({ queryKey: ['teachers'] }),
  });
}

export function useUpdateTeacher(id?: string) {
  const qc = useQueryClient();
  return useMutation((data: any) => adminAPI.updateTeacher(id as string, data), {
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['teachers'] });
      qc.invalidateQueries({ queryKey: ['teacher', id] });
    },
  });
}

export function useDeleteTeacher() {
  const qc = useQueryClient();
  return useMutation((id: string) => adminAPI.deleteTeacher(id), {
    onSuccess: () => qc.invalidateQueries({ queryKey: ['teachers'] }),
  });
}
