import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { adminAPI } from '@/lib/api/endpoints';

export function useAcademicTerms() {
  return useQuery(['academicTerms'], () => adminAPI.getAcademicTerms(), { staleTime: 1000 * 60 * 5 });
}

export function useCreateAcademicTerm() {
  const qc = useQueryClient();
  const m = useMutation<any, Error, any>((data: any) => adminAPI.createAcademicTerm(data), {
    onSuccess: () => qc.invalidateQueries({ queryKey: ['academicTerms'] }),
  });

  return {
    mutateAsync: m.mutateAsync,
    mutate: m.mutate,
    isLoading: (m as any).isLoading ?? m.status === 'loading',
    reset: m.reset,
    mutation: m,
  };
}

export function useUpdateAcademicTerm(id?: string) {
  const qc = useQueryClient();
  const m = useMutation<any, Error, any>((data: any) => adminAPI.updateAcademicTerm(id as string, data), {
    onSuccess: () => qc.invalidateQueries({ queryKey: ['academicTerms'] }),
  });

  return {
    mutateAsync: m.mutateAsync,
    mutate: m.mutate,
    isLoading: (m as any).isLoading ?? m.status === 'loading',
    reset: m.reset,
    mutation: m,
  };
}

export function useDeleteAcademicTerm() {
  const qc = useQueryClient();
  const m = useMutation<any, Error, string>((id: string) => adminAPI.deleteAcademicTerm(id), {
    onSuccess: () => qc.invalidateQueries({ queryKey: ['academicTerms'] }),
  });

  return {
    mutateAsync: m.mutateAsync,
    mutate: m.mutate,
    isLoading: (m as any).isLoading ?? m.status === 'loading',
    reset: m.reset,
    mutation: m,
  };
}