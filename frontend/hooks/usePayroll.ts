import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import adminAPI from '../lib/api/endpoints';
import { hrAPI } from '@/lib/api/endpoints';

export function usePayroll(params: { page?: number; search?: string } = { page: 1 }) {
  return useQuery(['payroll', params], () => adminAPI.get('/payroll', { params }).then((r) => r.data));
}

export function usePayrollRecord(id?: string, enabled = !!id) {
  return useQuery(['payroll', id], () => adminAPI.get(`/payroll/${id}`).then((r) => r.data), { enabled });
}

export function useCreatePayroll() {
  const qc = useQueryClient();
  return useMutation((payload: any) => adminAPI.post('/payroll', payload).then((r) => r.data), {
    onSuccess() { qc.invalidateQueries(['payroll']); }
  });
}

export function useUpdatePayroll(id?: string) {
  const qc = useQueryClient();
  return useMutation((payload: any) => adminAPI.put(`/payroll/${id}`, payload).then((r) => r.data), {
    onSuccess() { qc.invalidateQueries(['payroll']); qc.invalidateQueries(['payroll', id]); }
  });
}

export function useDeletePayroll() {
  const qc = useQueryClient();
  return useMutation((id: string) => adminAPI.delete(`/payroll/${id}`).then((r) => r.data), {
    onSuccess() { qc.invalidateQueries(['payroll']); }
  });
}

export function useGeneratePayroll() {
  const qc = useQueryClient();
  return useMutation((payload: any) => hrAPI.generatePayroll(payload).then((r: any) => r.data), {
    onSuccess() { qc.invalidateQueries(['payroll']); }
  });
}

export function useProcessPayroll() {
  const qc = useQueryClient();
  return useMutation((id: string) => hrAPI.processPayroll(id).then((r: any) => r.data), {
    onSuccess() { qc.invalidateQueries(['payroll']); }
  });
}
