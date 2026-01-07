import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { academicAPI } from '@/lib/api/endpoints';

export function useSubjects() {
  return useQuery(['subjects'], () => academicAPI.getSubjects(), { staleTime: 1000 * 60 * 5 });
}

export function useSubject(id?: string, enabled = !!id) {
  return useQuery(['subject', id], () => (id ? academicAPI.getSubjects() : Promise.resolve(null)), { enabled });
}

export function useCreateSubject() {
  const qc = useQueryClient();
  const m = useMutation<any, Error, any>((data: any) => academicAPI.createSimpleSubject(data), {
    onSuccess: () => qc.invalidateQueries({ queryKey: ['subjects'] }),
  });

  return {
    mutateAsync: m.mutateAsync,
    isLoading: (m as any).isLoading ?? m.status === 'loading',
    reset: m.reset,
    mutation: m,
  };
}

export function useUpdateSubject(id?: string) {
  const qc = useQueryClient();
  return useMutation((data: any) => academicAPI.updateSubject(id as string, data), {
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['subjects'] });
      qc.invalidateQueries({ queryKey: ['subject', id] });
    },
  });
}

export function useDeleteSubject() {
  const qc = useQueryClient();
  const m = useMutation<any, Error, string>((id: string) => academicAPI.deleteSubject(id), {
    onSuccess: () => qc.invalidateQueries({ queryKey: ['subjects'] }),
  });

  return {
    mutateAsync: m.mutateAsync,
    isLoading: (m as any).isLoading ?? m.status === 'loading',
    reset: m.reset,
    mutation: m,
  };
}