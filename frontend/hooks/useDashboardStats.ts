import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { adminAPI } from '@/lib/api/endpoints';

export interface DashboardStatsResponse {
  totalStudents: number;
  totalTeachers: number;
  totalClasses: number;
  totalRevenue: number;
  pendingFees?: number;
  attendanceRate?: number;
  newEnrollments?: number;
}

const defaultStats: DashboardStatsResponse = {
  totalStudents: 0,
  totalTeachers: 0,
  totalClasses: 0,
  totalRevenue: 0,
  pendingFees: 0,
  attendanceRate: 95,
  newEnrollments: 0,
};

export function useDashboardStats() {
  const options: UseQueryOptions<DashboardStatsResponse, Error> = {
    queryKey: ['dashboardStats'],
    queryFn: async () => {
      try {
        const response = await adminAPI.getDashboardStats();
        if (!response || !response.data) {
          throw new Error('Invalid response format');
        }
        // Ensure all fields have defaults
        return {
          totalStudents: response.data.totalStudents || 0,
          totalTeachers: response.data.totalTeachers || 0,
          totalClasses: response.data.totalClasses || 0,
          totalRevenue: response.data.totalRevenue || 0,
          pendingFees: response.data.pendingFees || 0,
          attendanceRate: response.data.attendanceRate || 95,
          newEnrollments: response.data.newEnrollments || 0,
        };
      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error);
        // Return default values on error
        return defaultStats;
      }
    },
    staleTime: 1000 * 60, // 60 seconds
    gcTime: 1000 * 60 * 5, // 5 minutes (formerly cacheTime)
    retry: 1,
    refetchOnWindowFocus: false,
  };

  return useQuery(options);
}