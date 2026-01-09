import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { adminSchoolAPI, superAdminAPI } from '@/lib/api/endpoints'
import { useAuthStore } from '@/store/authStore'

export default function useSchoolSettings() {
  const user = useAuthStore((s) => s.user)
  const schoolId = user?.schoolId
  const qc = useQueryClient()

  const isSuperAdmin = user?.role === 'super_admin'

  const query = useQuery(
    ['school', schoolId],
    () => (isSuperAdmin ? superAdminAPI.getSchool(schoolId as string) : adminSchoolAPI.getSchool(schoolId as string)),
    { enabled: !!schoolId }
  )

  const m = useMutation<any, Error, any>(
    (updates: any) => (isSuperAdmin ? superAdminAPI.updateSchool(schoolId as string, updates) : adminSchoolAPI.updateSchool(schoolId as string, updates)),
    {
    onSuccess: (res: any) => {
      // Invalidate or update cached school data
      qc.invalidateQueries(['school', schoolId])
    },
    }
  )

  return {
    school: query.data?.data,
    isLoading: query.isLoading,
    isError: query.isError,
    updateSchool: m.mutateAsync,
    updateStatus: m.status,
    updateLoading: (m as any).isLoading ?? m.status === 'loading',
    updateReset: m.reset,
    updateMutation: m,
  }
}
