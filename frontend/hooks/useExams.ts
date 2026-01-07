import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import adminAPI from '../lib/api/endpoints';

export function useExams(params: { page?: number; search?: string } = { page: 1 }) {
  return useQuery(['exams', params], () => adminAPI.get('/exams', { params }).then((r) => r.data));
}

export function useExam(id?: string, enabled = !!id) {
  return useQuery(['exam', id], () => adminAPI.get(`/exams/${id}`).then((r) => r.data), { enabled });
}

export function useCreateExam() {
  const qc = useQueryClient();
  return useMutation((payload: any) => adminAPI.post('/exams', payload).then((r) => r.data), {
    onSuccess() { qc.invalidateQueries(['exams']); }
  });
}

export function useUpdateExam(id?: string) {
  const qc = useQueryClient();
  return useMutation((payload: any) => adminAPI.put(`/exams/${id}`, payload).then((r) => r.data), {
    onSuccess() { qc.invalidateQueries(['exams']); qc.invalidateQueries(['exam', id]); }
  });
}

export function useDeleteExam() {
  const qc = useQueryClient();
  return useMutation((id: string) => adminAPI.delete(`/exams/${id}`).then((r) => r.data), {
    onSuccess() { qc.invalidateQueries(['exams']); }
  });
}
