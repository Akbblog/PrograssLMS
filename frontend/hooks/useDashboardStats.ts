import { useQuery } from '@tanstack/react-query';
import { adminAPI } from '@/lib/api/endpoints';

export function useDashboardStats() {
  return useQuery(['dashboardStats'], () => adminAPI.getDashboardStats(), { staleTime: 1000 * 30 });
}