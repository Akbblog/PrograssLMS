import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { academicAPI } from '@/lib/api/endpoints';

export function useClasses() {
  return useQuery(['classes'], () => academicAPI.getClasses(), { staleTime: 1000 * 60 * 5 });
}

export function useClass(id?: string, enabled = !!id) {
  return useQuery(['class', id], () => (id ? academicAPI.getClass(id) : Promise.resolve(null)), { enabled });
}

export function useCreateClass() {
  const qc = useQueryClient();
  return useMutation((data: any) => academicAPI.createClass(data), { onSuccess: () => qc.invalidateQueries({ queryKey: ['classes'] }) });
}

export function useUpdateClass(id?: string) {
  const qc = useQueryClient();
  return useMutation((data: any) => academicAPI.updateClass(id as string, data), {
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['classes'] });
      qc.invalidateQueries({ queryKey: ['class', id] });
    },
  });
}

export function useDeleteClass() {
  const qc = useQueryClient();
  return useMutation((id: string) => academicAPI.deleteClass(id), { onSuccess: () => qc.invalidateQueries({ queryKey: ['classes'] }) });
}