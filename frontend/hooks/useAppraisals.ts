import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import adminAPI from '../lib/api/endpoints';

export function useAppraisals(params: { page?: number; search?: string } = { page: 1 }) {
  return useQuery(['appraisals', params], () => adminAPI.get('/appraisals', { params }).then((r) => r.data));
}

export function useAppraisal(id?: string, enabled = !!id) {
  return useQuery(['appraisal', id], () => adminAPI.get(`/appraisals/${id}`).then((r) => r.data), { enabled });
}

export function useCreateAppraisal() {
  const qc = useQueryClient();
  const m = useMutation<any, Error, any>((payload: any) => adminAPI.post('/appraisals', payload).then((r) => r.data), {
    onSuccess() { qc.invalidateQueries(['appraisals']); }
  });

  return {
    mutateAsync: m.mutateAsync,
    mutate: m.mutate,
    isLoading: (m as any).isLoading ?? m.status === 'loading',
    reset: m.reset,
    mutation: m,
  };
}

export function useUpdateAppraisal(id?: string) {
  const qc = useQueryClient();
  const m = useMutation<any, Error, any>((payload: any) => adminAPI.put(`/appraisals/${id}`, payload).then((r) => r.data), {
    onSuccess() { qc.invalidateQueries(['appraisals']); qc.invalidateQueries(['appraisal', id]); }
  });

  return {
    mutateAsync: m.mutateAsync,
    mutate: m.mutate,
    isLoading: (m as any).isLoading ?? m.status === 'loading',
    reset: m.reset,
    mutation: m,
  };
}

export function useDeleteAppraisal() {
  const qc = useQueryClient();
  const m = useMutation<any, Error, string>((id: string) => adminAPI.delete(`/appraisals/${id}`).then((r) => r.data), {
    onSuccess() { qc.invalidateQueries(['appraisals']); }
  });

  return {
    mutateAsync: m.mutateAsync,
    mutate: m.mutate,
    isLoading: (m as any).isLoading ?? m.status === 'loading',
    reset: m.reset,
    mutation: m,
  };
}
