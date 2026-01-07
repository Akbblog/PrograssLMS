import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import adminAPI from '../lib/api/endpoints';

export function useStaff(params: { page?: number; search?: string } = { page: 1 }) {
  return useQuery(['staff', params], () => adminAPI.get('/staff', { params }).then((r) => r.data));
}

export function useStaffMember(id?: string, enabled = !!id) {
  return useQuery(['staff', id], () => adminAPI.get(`/staff/${id}`).then((r) => r.data), { enabled });
}

export function useCreateStaff() {
  const qc = useQueryClient();
  const m = useMutation<any, Error, any>((payload: any) => adminAPI.post('/staff', payload).then((r) => r.data), {
    onSuccess() { qc.invalidateQueries(['staff']); }
  });

  return {
    mutateAsync: m.mutateAsync,
    isLoading: (m as any).isLoading ?? m.status === 'loading',
    reset: m.reset,
    mutation: m,
  };
}

export function useUpdateStaff(id?: string) {
  const qc = useQueryClient();
  const m = useMutation<any, Error, any>((payload: any) => adminAPI.put(`/staff/${id}`, payload).then((r) => r.data), {
    onSuccess() { qc.invalidateQueries(['staff']); qc.invalidateQueries(['staff', id]); }
  });

  return {
    mutateAsync: m.mutateAsync,
    isLoading: (m as any).isLoading ?? m.status === 'loading',
    reset: m.reset,
    mutation: m,
  };
}

export function useDeleteStaff() {
  const qc = useQueryClient();
  const m = useMutation<any, Error, string>((id: string) => adminAPI.delete(`/staff/${id}`).then((r) => r.data), {
    onSuccess() { qc.invalidateQueries(['staff']); }
  });

  return {
    mutateAsync: m.mutateAsync,
    isLoading: (m as any).isLoading ?? m.status === 'loading',
    reset: m.reset,
    mutation: m,
  };
}
