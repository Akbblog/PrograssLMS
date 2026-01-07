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
  const m = useMutation<any, Error, any>((payload: any) => adminAPI.post('/library/books', payload).then((r) => r.data), {
    onSuccess() { qc.invalidateQueries(['books']); }
  });

  return {
    mutateAsync: m.mutateAsync,
    isLoading: (m as any).isLoading ?? m.status === 'loading',
    reset: m.reset,
    mutation: m,
  };
}

export function useUpdateBook(id?: string) {
  const qc = useQueryClient();
  const m = useMutation<any, Error, any>((payload: any) => adminAPI.put(`/library/books/${id}`, payload).then((r) => r.data), {
    onSuccess() { qc.invalidateQueries(['books']); qc.invalidateQueries(['book', id]); }
  });

  return {
    mutateAsync: m.mutateAsync,
    isLoading: (m as any).isLoading ?? m.status === 'loading',
    reset: m.reset,
    mutation: m,
  };
}

export function useDeleteBook() {
  const qc = useQueryClient();
  const m = useMutation<any, Error, string>((id: string) => adminAPI.delete(`/library/books/${id}`).then((r) => r.data), {
    onSuccess() { qc.invalidateQueries(['books']); }
  });

  return {
    mutateAsync: m.mutateAsync,
    isLoading: (m as any).isLoading ?? m.status === 'loading',
    reset: m.reset,
    mutation: m,
  };
}
