import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import adminAPI from '../lib/api/endpoints';
import { hrAPI } from '@/lib/api/endpoints';

export function usePayroll(params: { page?: number; search?: string } = { page: 1 }) {
  return useQuery(['payroll', params], () => hrAPI.getPayrolls(params).then((r: any) => r.data));
}

export function usePayrollRecord(id?: string, enabled = !!id) {
  return useQuery(['payroll', id], () => adminAPI.get(`/hr/payroll/${id}`).then((r) => r.data), { enabled });
}

export function useCreatePayroll() {
  const qc = useQueryClient();
  const m = useMutation<any, Error, any>((payload: any) => adminAPI.post('/hr/payroll', payload).then((r) => r.data), {
    onSuccess() { qc.invalidateQueries(['payroll']); }
  });

  return {
    mutateAsync: m.mutateAsync,
    mutate: m.mutate,
    isLoading: (m as any).isLoading ?? m.status === 'loading',
    reset: m.reset,
    mutation: m,
  };
}

export function useUpdatePayroll(id?: string) {
  const qc = useQueryClient();
  const m = useMutation<any, Error, any>((payload: any) => adminAPI.put(`/hr/payroll/${id}`, payload).then((r) => r.data), {
    onSuccess() { qc.invalidateQueries(['payroll']); qc.invalidateQueries(['payroll', id]); }
  });

  return {
    mutateAsync: m.mutateAsync,
    mutate: m.mutate,
    isLoading: (m as any).isLoading ?? m.status === 'loading',
    reset: m.reset,
    mutation: m,
  };
}

export function useDeletePayroll() {
  const qc = useQueryClient();
  const m = useMutation<any, Error, string>((id: string) => adminAPI.delete(`/hr/payroll/${id}`).then((r) => r.data), {
    onSuccess() { qc.invalidateQueries(['payroll']); }
  });

  return {
    mutateAsync: m.mutateAsync,
    mutate: m.mutate,
    isLoading: (m as any).isLoading ?? m.status === 'loading',
    reset: m.reset,
    mutation: m,
  };
}

export function useGeneratePayroll() {
  const qc = useQueryClient();
  type GeneratePayload = { month: number; year: number; staffId?: string };

  const m = useMutation<any, Error, GeneratePayload>((payload: GeneratePayload) => hrAPI.generatePayroll(payload).then((r: any) => r.data), {
    onSuccess() { qc.invalidateQueries(['payroll']); }
  });

  return {
    mutateAsync: m.mutateAsync,
    mutate: m.mutate,
    isLoading: (m as any).isLoading ?? m.status === 'loading',
    reset: m.reset,
    mutation: m,
  };
}

export function useProcessPayroll() {
  const qc = useQueryClient();
  const m = useMutation<any, Error, string>((id: string) => hrAPI.processPayroll(id).then((r: any) => r.data), {
    onSuccess() { qc.invalidateQueries(['payroll']); }
  });

  return {
    mutateAsync: m.mutateAsync,
    isLoading: (m as any).isLoading ?? m.status === 'loading',
    reset: m.reset,
    mutation: m,
  };
}
