import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import adminAPI from '../lib/api/endpoints';

export function useRoutes(params: { page?: number; search?: string } = { page: 1 }) {
  return useQuery(['routes', params], () => adminAPI.get('/transport/routes', { params }).then((r) => r.data));
}

export function useRoute(id?: string, enabled = !!id) {
  return useQuery(['route', id], () => adminAPI.get(`/transport/routes/${id}`).then((r) => r.data), { enabled });
}

export function useCreateRoute() {
  const qc = useQueryClient();
  const m = useMutation<any, Error, any>((payload: any) => adminAPI.post('/transport/routes', payload).then((r) => r.data), {
    onSuccess() { qc.invalidateQueries(['routes']); }
  });

  return {
    mutateAsync: m.mutateAsync,
    mutate: m.mutate,
    isLoading: (m as any).isLoading ?? m.status === 'loading',
    reset: m.reset,
    mutation: m,
  };
}

export function useUpdateRoute(id?: string) {
  const qc = useQueryClient();
  const m = useMutation<any, Error, any>((payload: any) => adminAPI.put(`/transport/routes/${id}`, payload).then((r) => r.data), {
    onSuccess() { qc.invalidateQueries(['routes']); qc.invalidateQueries(['route', id]); }
  });

  return {
    mutateAsync: m.mutateAsync,
    mutate: m.mutate,
    isLoading: (m as any).isLoading ?? m.status === 'loading',
    reset: m.reset,
    mutation: m,
  };
}

export function useDeleteRoute() {
  const qc = useQueryClient();
  const m = useMutation<any, Error, string>((id: string) => adminAPI.delete(`/transport/routes/${id}`).then((r) => r.data), {
    onSuccess() { qc.invalidateQueries(['routes']); }
  });

  return {
    mutateAsync: m.mutateAsync,
    mutate: m.mutate,
    isLoading: (m as any).isLoading ?? m.status === 'loading',
    reset: m.reset,
    mutation: m,
  };
}

export function useVehicles() {
  return useQuery(['vehicles'], () => adminAPI.get('/transport/vehicles').then((r) => r.data), { staleTime: 1000 * 60 * 5 });
}
