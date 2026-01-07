import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminAPI } from '@/lib/api/endpoints';

export function useDocumentTemplates() {
  return useQuery(['documents','templates'], () => adminAPI.getDocumentTemplates());
}

export function useCreateDocumentTemplate() {
  const qc = useQueryClient();
  type CreatePayload = { templateName: string; templateType: string };

  const m = useMutation<any, Error, CreatePayload>((payload: CreatePayload) => adminAPI.createDocumentTemplate(payload), {
    onSuccess() { qc.invalidateQueries(['documents','templates']); qc.invalidateQueries(['documents']); }
  });

  return {
    mutateAsync: m.mutateAsync,
    mutate: m.mutate,
    isLoading: (m as any).isLoading ?? m.status === 'loading',
    reset: m.reset,
    mutation: m,
  };
}

export function useDeleteDocumentTemplate() {
  const qc = useQueryClient();
  const m = useMutation<any, Error, string>((id: string) => adminAPI.deleteDocumentTemplate(id), {
    onSuccess() { qc.invalidateQueries(['documents','templates']); qc.invalidateQueries(['documents']); }
  });

  return {
    mutateAsync: m.mutateAsync,
    mutate: m.mutate,
    isLoading: (m as any).isLoading ?? m.status === 'loading',
    reset: m.reset,
    mutation: m,
  };
}
