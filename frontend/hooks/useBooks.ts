import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import adminAPI from '../lib/api/endpoints';

export function useBooks(params: { page?: number; search?: string } = { page: 1 }) {
  return useQuery(['books', params], () => adminAPI.get('/library/books', { params }).then((r) => r.data));
}

export function useBook(id?: string, enabled = !!id) {
  return useQuery(['book', id], () => adminAPI.get(`/library/books/${id}`).then((r) => r.data), { enabled });
}

export function useCreateBook() {
  const qc = useQueryClient();
  return useMutation((payload: any) => adminAPI.post('/library/books', payload).then((r) => r.data), {
    onSuccess() { qc.invalidateQueries(['books']); }
  });
}

export function useUpdateBook(id?: string) {
  const qc = useQueryClient();
  return useMutation((payload: any) => adminAPI.put(`/library/books/${id}`, payload).then((r) => r.data), {
    onSuccess() { qc.invalidateQueries(['books']); qc.invalidateQueries(['book', id]); }
  });
}

export function useDeleteBook() {
  const qc = useQueryClient();
  return useMutation((id: string) => adminAPI.delete(`/library/books/${id}`).then((r) => r.data), {
    onSuccess() { qc.invalidateQueries(['books']); }
  });
}
