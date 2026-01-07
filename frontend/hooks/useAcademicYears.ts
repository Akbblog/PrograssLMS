import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { adminAPI, academicAPI } from '@/lib/api/endpoints';

export function useAcademicYears() {
  return useQuery(['academicYears'], () => adminAPI.getAcademicYears(), { staleTime: 1000 * 60 * 5 });
}

export function useCreateAcademicYear() {
  const qc = useQueryClient();
  return useMutation((data: any) => adminAPI.createAcademicYear(data), { onSuccess: () => qc.invalidateQueries({ queryKey: ['academicYears'] }) });
}

export function useUpdateAcademicYear(id?: string) {
  const qc = useQueryClient();
  return useMutation((data: any) => adminAPI.updateAcademicYear(id as string, data), {
    onSuccess: () => qc.invalidateQueries({ queryKey: ['academicYears'] }),
  });
}

export function useDeleteAcademicYear() {
  const qc = useQueryClient();
  return useMutation((id: string) => adminAPI.deleteAcademicYear(id), { onSuccess: () => qc.invalidateQueries({ queryKey: ['academicYears'] }) });
}