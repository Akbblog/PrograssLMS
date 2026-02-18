import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import adminAPI from '../lib/api/endpoints';

const getBackendErrorMessage = (error: any, fallback: string) => {
  return (
    error?.message ||
    error?.response?.data?.message ||
    error?.data?.message ||
    error?.error ||
    fallback
  );
};

export function useStaff(params: { page?: number; search?: string } = { page: 1 }) {
  return useQuery(['staff', params], () => adminAPI.get('/hr/staff', { params }).then((r) => r.data));
}

export function useStaffMember(id?: string, enabled = !!id) {
  return useQuery(['staff', id], () => adminAPI.get(`/hr/staff/${id}`).then((r) => r.data), { enabled });
}

export function useCreateStaff() {
  const qc = useQueryClient();
  const m = useMutation<any, Error, any>(async (payload: any) => {
    try {
      const response: any = await adminAPI.post('/hr/staff', payload);
      return response?.data ?? response;
    } catch (error: any) {
      throw new Error(getBackendErrorMessage(error, 'Failed to create staff'));
    }
  }, {
    onSuccess() { qc.invalidateQueries(['staff']); }
  });

  return {
    mutateAsync: m.mutateAsync,
    mutate: m.mutate,
    isLoading: (m as any).isLoading ?? m.status === 'loading',
    reset: m.reset,
    mutation: m,
  };
}

export function useUpdateStaff(id?: string) {
  const qc = useQueryClient();
  const m = useMutation<any, Error, any>((payload: any) => adminAPI.put(`/hr/staff/${id}`, payload).then((r) => r.data), {
    onSuccess() { qc.invalidateQueries(['staff']); qc.invalidateQueries(['staff', id]); }
  });

  return {
    mutateAsync: m.mutateAsync,
    mutate: m.mutate,
    isLoading: (m as any).isLoading ?? m.status === 'loading',
    reset: m.reset,
    mutation: m,
  };
}

export function useDeleteStaff() {
  const qc = useQueryClient();
  const m = useMutation<any, Error, string>((id: string) => adminAPI.delete(`/hr/staff/${id}`).then((r) => r.data), {
    onSuccess() { qc.invalidateQueries(['staff']); }
  });

  return {
    mutateAsync: m.mutateAsync,
    mutate: m.mutate,
    isLoading: (m as any).isLoading ?? m.status === 'loading',
    reset: m.reset,
    mutation: m,
  };
}
