import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { academicAPI } from '@/lib/api/endpoints';

export function usePrograms() {
  return useQuery(['programs'], () => academicAPI.getPrograms(), { staleTime: 1000 * 60 * 5 });
}

export function useProgram(id?: string, enabled = !!id) {
  return useQuery(['program', id], () => (id ? academicAPI.getPrograms() : Promise.resolve(null)), { enabled });
}

export function useCreateProgram() {
  const qc = useQueryClient();
  const m = useMutation<any, Error, any>((data: any) => academicAPI.createProgram(data), { onSuccess: () => qc.invalidateQueries({ queryKey: ['programs'] }) });

  return {
    mutateAsync: m.mutateAsync,
    isLoading: (m as any).isLoading ?? m.status === 'loading',
    reset: m.reset,
    mutation: m,
  };
}

export function useUpdateProgram(id?: string) {
  const qc = useQueryClient();
  const m = useMutation<any, Error, any>((data: any) => academicAPI.updateProgram(id as string, data), {
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['programs'] });
      qc.invalidateQueries({ queryKey: ['program', id] });
    },
  });

  return {
    mutateAsync: m.mutateAsync,
    isLoading: (m as any).isLoading ?? m.status === 'loading',
    reset: m.reset,
    mutation: m,
  };
}

export function useDeleteProgram() {
  const qc = useQueryClient();
  const m = useMutation<any, Error, string>((id: string) => academicAPI.deleteProgram(id), { onSuccess: () => qc.invalidateQueries({ queryKey: ['programs'] }) });

  return {
    mutateAsync: m.mutateAsync,
    isLoading: (m as any).isLoading ?? m.status === 'loading',
    reset: m.reset,
    mutation: m,
  };
}