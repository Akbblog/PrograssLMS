import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { adminAPI } from '@/lib/api/endpoints';

export function useAcademicTerms() {
  return useQuery(['academicTerms'], () => adminAPI.getAcademicTerms(), { staleTime: 1000 * 60 * 5 });
}

export function useCreateAcademicTerm() {
  const qc = useQueryClient();
  return useMutation((data: any) => adminAPI.createAcademicTerm(data), { onSuccess: () => qc.invalidateQueries({ queryKey: ['academicTerms'] }) });
}

export function useUpdateAcademicTerm(id?: string) {
  const qc = useQueryClient();
  return useMutation((data: any) => adminAPI.updateAcademicTerm(id as string, data), { onSuccess: () => qc.invalidateQueries({ queryKey: ['academicTerms'] }) });
}

export function useDeleteAcademicTerm() {
  const qc = useQueryClient();
  return useMutation((id: string) => adminAPI.deleteAcademicTerm(id), { onSuccess: () => qc.invalidateQueries({ queryKey: ['academicTerms'] }) });
}