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
  return useMutation((payload: any) => adminAPI.post('/transport/routes', payload).then((r) => r.data), {
    onSuccess() { qc.invalidateQueries(['routes']); }
  });
}

export function useUpdateRoute(id?: string) {
  const qc = useQueryClient();
  return useMutation((payload: any) => adminAPI.put(`/transport/routes/${id}`, payload).then((r) => r.data), {
    onSuccess() { qc.invalidateQueries(['routes']); qc.invalidateQueries(['route', id]); }
  });
}

export function useDeleteRoute() {
  const qc = useQueryClient();
  return useMutation((id: string) => adminAPI.delete(`/transport/routes/${id}`).then((r) => r.data), {
    onSuccess() { qc.invalidateQueries(['routes']); }
  });
}

export function useVehicles() {
  return useQuery(['vehicles'], () => adminAPI.get('/transport/vehicles').then((r) => r.data), { staleTime: 1000 * 60 * 5 });
}
