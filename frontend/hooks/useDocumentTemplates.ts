import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminAPI } from '@/lib/api/endpoints';

export function useDocumentTemplates() {
  return useQuery(['documents','templates'], () => adminAPI.getDocumentTemplates());
}

export function useCreateDocumentTemplate() {
  const qc = useQueryClient();
  return useMutation((payload: any) => adminAPI.createDocumentTemplate(payload), {
    onSuccess() { qc.invalidateQueries(['documents','templates']); qc.invalidateQueries(['documents']); }
  })
}

export function useDeleteDocumentTemplate() {
  const qc = useQueryClient();
  return useMutation((id: string) => adminAPI.deleteDocumentTemplate(id), {
    onSuccess() { qc.invalidateQueries(['documents','templates']); qc.invalidateQueries(['documents']); }
  })
}
