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
  return useMutation((data: any) => academicAPI.createProgram(data), { onSuccess: () => qc.invalidateQueries({ queryKey: ['programs'] }) });
}

export function useUpdateProgram(id?: string) {
  const qc = useQueryClient();
  return useMutation((data: any) => academicAPI.updateProgram(id as string, data), {
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['programs'] });
      qc.invalidateQueries({ queryKey: ['program', id] });
    },
  });
}

export function useDeleteProgram() {
  const qc = useQueryClient();
  return useMutation((id: string) => academicAPI.deleteProgram(id), { onSuccess: () => qc.invalidateQueries({ queryKey: ['programs'] }) });
}