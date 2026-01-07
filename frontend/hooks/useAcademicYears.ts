import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { adminAPI, academicAPI } from '@/lib/api/endpoints';

export function useAcademicYears() {
  return useQuery(['academicYears'], () => adminAPI.getAcademicYears(), { staleTime: 1000 * 60 * 5 });
}

export function useCreateAcademicYear() {
  const qc = useQueryClient();
  const m = useMutation<any, Error, any>((data: any) => adminAPI.createAcademicYear(data), {
    onSuccess: () => qc.invalidateQueries({ queryKey: ['academicYears'] }),
  });

  return {
    mutateAsync: m.mutateAsync,
    mutate: m.mutate,
    isLoading: (m as any).isLoading ?? m.status === 'loading',
    reset: m.reset,
    mutation: m,
  };
} 

export function useUpdateAcademicYear(id?: string) {
  const qc = useQueryClient();
  const m = useMutation<any, Error, any>((data: any) => adminAPI.updateAcademicYear(id as string, data), {
    onSuccess: () => qc.invalidateQueries({ queryKey: ['academicYears'] }),
  });

  return {
    mutateAsync: m.mutateAsync,
    mutate: m.mutate,
    isLoading: (m as any).isLoading ?? m.status === 'loading',
    reset: m.reset,
    mutation: m,
  };
} 

export function useDeleteAcademicYear() {
  const qc = useQueryClient();
  const m = useMutation<any, Error, string>((id: string) => adminAPI.deleteAcademicYear(id), {
    onSuccess: () => qc.invalidateQueries({ queryKey: ['academicYears'] }),
  });

  return {
    mutateAsync: m.mutateAsync,
    mutate: m.mutate,
    isLoading: (m as any).isLoading ?? m.status === 'loading',
    reset: m.reset,
    mutation: m,
  };
}