import axios from 'axios';
import { useAuthStore } from '@/store/authStore';

// Use environment-provided API host in dev/preview; default to relative path in
// production so the frontend talks to the same origin (avoids hard-coded localhost)
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add JWT token to requests
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    let token: string | null = null;

    // Try to get token from localStorage directly
    try {
      token = localStorage.getItem('token');
    } catch (e) {
      console.warn("⚠️ endpoints.ts: LocalStorage access failed:", e);
    }

    // Fallback to Zustand store if localStorage failed or is empty
    if (!token) {
      try {
        const authState = useAuthStore.getState();
        if (authState.token) {
          token = authState.token;
          console.log("🔐 endpoints.ts: recovered token from AuthStore");
        }
      } catch (e) {
        console.warn("⚠️ endpoints.ts: Failed to access AuthStore state:", e);
      }
    }

    const isAuthRequest = config.url?.includes('/login') || config.url?.includes('/register');

    if (token && token !== "undefined" && token !== "null" && !isAuthRequest) {
      // Only log a substring to avoid cluttering logs, but confirm it's being attached
      if (process.env.NODE_ENV === 'development') {
        console.log("🔐 endpoints.ts: Attaching token:", token.substring(0, 10) + "...");
      }
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      if (!isAuthRequest) {
        console.warn("⚠️ endpoints.ts: Invalid or missing token in localStorage/store:", token);
      }
    }
  }
  return config;
});

// Handle responses
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // Log 401 errors but DO NOT automatically logout
    // This prevents unexpected logouts during form submissions
    // The ProtectedRoute component handles session validation on page load
    if (error.response?.status === 401) {
      const url = error.config?.url || '';
      console.warn(`⚠️ 401 Unauthorized on ${url} - letting component handle error`);

      // Only clear storage and redirect for explicit profile/session check failures
      // These typically happen when user navigates to protected pages with invalid token
      const errorMsg = error.response?.data?.message || "";
      const isSessionCheck = url.includes('/admin/profile') ||
        url.includes('/teacher/profile') ||
        url.includes('/students/profile');

      const isInvalidUser = errorMsg.includes("User not found") || errorMsg.includes("Unauthorized: User not found");

      if (isSessionCheck || isInvalidUser) {
        console.warn("⚠️ Session validation failed or User not found - clearing credentials");
        try {
          if (typeof window !== 'undefined') {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
          }
        } catch (e) {
          console.error("Failed to clear local storage:", e);
        }

        // If it's a data request failure (not a profile check), we might want to redirect to login
        if (typeof window !== 'undefined' && isInvalidUser) {
          window.location.href = '/login';
        }
      }
    }

    // Always reject with proper error data for components to handle
    return Promise.reject(error.response?.data || error);
  }
);


// Auth endpoints
export const authAPI = {
  loginAdmin: (credentials: { email: string; password: string }) =>
    api.post('/admin/login', credentials),

  loginTeacher: (credentials: { email: string; password: string }) =>
    api.post('/teacher/login', credentials),

  loginStudent: (credentials: { email: string; password: string }) =>
    api.post('/students/login', credentials),

  loginSuperAdmin: (credentials: { email: string; password: string }) =>
    api.post('/superadmin/login', credentials),

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};

// Superadmin endpoints
export const superAdminAPI = {
  getSchools: () => api.get('/superadmin/schools'),
  createSchool: (data: any) => api.post('/superadmin/schools', data),
  getSchool: (id: string) => api.get(`/superadmin/schools/${id}`),
  updateSchool: (id: string, data: any) => api.put(`/superadmin/schools/${id}`, data),
  updateSubscription: (id: string, data: any) => api.put(`/superadmin/schools/${id}/subscription`, data),
  toggleSchoolStatus: (id: string, data: any) => api.put(`/superadmin/schools/${id}/status`, data),
  deleteSchool: (id: string) => api.delete(`/superadmin/schools/${id}`),
  getAnalytics: () => api.get('/superadmin/analytics'),
};

// Admin endpoints
export const adminAPI = {
  getStudents: (params?: any) => api.get('/students', { params }),
  getStudent: (id: string) => api.get(`/students/${id}`),
  createStudent: (data: any) => api.post('/students', data),
  updateStudent: (id: string, data: any) => api.patch(`/students/${id}`, data),
  deleteStudent: (id: string) => api.delete(`/students/${id}`),
  getTeachers: (params?: any) => api.get('/teachers', { params }),
  createTeacher: (data: any) => api.post('/teachers', data),
  updateTeacher: (id: string, data: any) => api.patch(`/teachers/${id}`, data),
  deleteTeacher: (id: string) => api.delete(`/teachers/${id}`),
  withdrawTeacher: (id: string) => api.put(`/admins/withdraw/teacher/${id}`),
  restoreTeacher: (id: string) => api.put(`/admins/unwithdraw/teacher/${id}`),
  getClasses: () => api.get('/class-levels'),
  getAcademicYears: () => api.get('/academic-years'),
  createAcademicYear: (data: any) => api.post('/academic-years', data),
  updateAcademicYear: (id: string, data: any) => api.patch(`/academic-years/${id}`, data),
  deleteAcademicYear: (id: string) => api.delete(`/academic-years/${id}`),
  getAcademicTerms: () => api.get('/academic-term'),
  createAcademicTerm: (data: any) => api.post('/academic-term', data),
  updateAcademicTerm: (id: string, data: any) => api.patch(`/academic-term/${id}`, data),
  deleteAcademicTerm: (id: string) => api.delete(`/academic-term/${id}`),
  getDashboardStats: () => api.get('/admin/stats'),
  // Student dashboard
  getStudentDashboard: () => api.get('/students/dashboard'),
  // Export utilities
  exportStudents: () => api.get('/admin/export/students', { responseType: 'blob' as any }),
  exportTeachers: () => api.get('/admin/export/teachers', { responseType: 'blob' as any }),
};

// Finance endpoints
export const financeAPI = {
  createFeeStructure: (data: any) => api.post('/finance/fees/structure', data),
  getFeeStructures: () => api.get('/finance/fees/structure'),
  recordPayment: (data: any) => api.post('/finance/fees/payment', data),
  getStudentPayments: (studentId: string) => api.get(`/finance/fees/student/${studentId}`),
  getDueFees: (studentId: string) => api.get(`/finance/fees/due/${studentId}`),
  // Advanced Finance
  generateStudentFee: (data: any) => api.post('/finance/generate-student-fee', data),
  getFinancialReport: (params: any) => api.get('/finance/report', { params }),
  getReminders: () => api.get('/finance/reminders'),
};

// Attendance endpoints
export const attendanceAPI = {
  // Student Attendance
  markAttendance: (data: any) => api.post('/attendance', data),
  markStudentAttendance: (data: any) => api.post('/attendance', data),
  getAttendance: (classLevel: string, date: string) => api.get(`/attendance?classLevel=${classLevel}&date=${date}`),
  getStudentsForAttendance: (classLevel: string) => api.get(`/attendance/students/${classLevel}`),
  getStudentAttendance: (studentId: string) => api.get(`/attendance/student/${studentId}`),
  getStudentAttendanceRecord: (studentId: string) => api.get(`/attendance/student/${studentId}`),
  getAttendanceHistory: (classLevel: string, startDate?: string, endDate?: string) =>
    api.get(`/attendance/history/${classLevel}`, { params: { startDate, endDate } }),
  getAttendanceSummary: (classLevel: string, startDate?: string, endDate?: string) =>
    api.get(`/attendance/summary/${classLevel}`, { params: { startDate, endDate } }),

  // Teacher Attendance
  markTeacherAttendance: (data: any) => api.post('/teacher-attendance', data),
  getTeacherAttendance: (date: string) => api.get(`/teacher-attendance?date=${date}`),
  getTeachersForAttendance: () => api.get('/teacher-attendance/teachers'),
  getTeacherAttendanceHistory: (startDate?: string, endDate?: string) =>
    api.get('/teacher-attendance/history', { params: { startDate, endDate } }),
  getIndividualTeacherAttendance: (teacherId: string, startDate?: string, endDate?: string) =>
    api.get(`/teacher-attendance/teacher/${teacherId}`, { params: { startDate, endDate } }),
  getTeacherAttendanceSummary: (startDate?: string, endDate?: string) =>
    api.get('/teacher-attendance/summary', { params: { startDate, endDate } }),
};

// Academic endpoints
export const academicAPI = {
  getClasses: () => api.get('/class-levels'),
  createClass: (data: any) => api.post('/class-levels', data),
  getClass: (id: string) => api.get(`/class-levels/${id}`),
  updateClass: (id: string, data: any) => api.patch(`/class-levels/${id}`, data),
  deleteClass: (id: string) => api.delete(`/class-levels/${id}`),
  getPrograms: () => api.get('/programs'),
  createProgram: (data: any) => api.post('/programs', data),
  updateProgram: (id: string, data: any) => api.patch(`/programs/${id}`, data),
  deleteProgram: (id: string) => api.delete(`/programs/${id}`),
  getSubjects: () => api.get('/subject'),
  createSubject: (programId: string, data: any) => api.post(`/create-subject/${programId}`, data),
  createSimpleSubject: (data: any) => api.post('/subjects', data),
  updateSubject: (id: string, data: any) => api.patch(`/subject/${id}`, data),
  deleteSubject: (id: string) => api.delete(`/subject/${id}`),
  getStudentsByClass: (classId: string) => api.get(`/admin/students?currentClassLevel=${classId}`),
  getSubjectsByClass: (classId: string) => api.get(`/admin/subjects-by-class/${classId}`),
  getTeachersByClass: (classId: string) => api.get(`/admin/teachers-by-class/${classId}`),
  assignSubjectToClass: (classId: string, subjectId: string) => api.post(`/class-levels/${classId}/subjects/${subjectId}`),
  removeSubjectFromClass: (classId: string, subjectId: string) => api.delete(`/class-levels/${classId}/subjects/${subjectId}`),
  getAcademicYears: () => api.get('/academic-years'),
  getAcademicTerms: () => api.get('/academic-term'),
};

// Assignment endpoints
export const assignmentAPI = {
  getAssignments: (params?: any) => api.get('/academic/assignments', { params }),
  createAssignment: (data: any) => api.post('/academic/assignments', data),
  submitAssignment: (assignmentId: string, data: any) => api.post(`/academic/assignments/${assignmentId}/submit`, data),
  gradeSubmission: (assignmentId: string, studentId: string, data: any) => api.post(`/academic/assignments/${assignmentId}/grade/${studentId}`, data),
};

// Enrollment endpoints
export const enrollmentAPI = {
  getStudentEnrollments: (studentId: string) => api.get(`/academic/enrollments/student/${studentId}`),
  createEnrollment: (data: any) => api.post('/academic/enrollments', data),
  updateProgress: (enrollmentId: string, progress: number) => api.patch(`/academic/enrollments/${enrollmentId}/progress`, { progress }),
};

// Grade endpoints
export const gradeAPI = {
  getStudentGrades: (studentId: string, params?: any) => api.get(`/academic/grades/student/${studentId}`, { params }),
  getClassGrades: (params: any) => api.get('/academic/grades/class', { params }),
  createGrade: (data: any) => api.post('/academic/grades', data),
};

// Grading Policy endpoints
export const gradingPolicyAPI = {
  getAll: () => api.get('/grading-policies'),
  getById: (id: string) => api.get(`/grading-policies/${id}`),
  create: (data: any) => api.post('/grading-policies', data),
  update: (id: string, data: any) => api.patch(`/grading-policies/${id}`, data),
  delete: (id: string) => api.delete(`/grading-policies/${id}`),
  getActive: (academicYearId?: string) => api.get('/grading-policies/active', { params: { academicYearId } }),
};

// Performance endpoints
export const performanceAPI = {
  getStudentPerformance: (studentId: string, academicYear: string, academicTerm: string) =>
    api.get(`/performance/student/${studentId}`, { params: { academicYear, academicTerm } }),
  getClassPerformance: (classLevelId: string, subjectId: string, academicYear: string, academicTerm: string) =>
    api.get(`/performance/class/${classLevelId}`, { params: { subject: subjectId, academicYear, academicTerm } }),
};

// Teacher endpoints
export const teacherAPI = {
  getDashboard: () => api.get('/teacher/dashboard'),
};

// Behavior & Risk Alert endpoints
export const behaviorAPI = {
  getStudentProfile: (studentId: string, academicYearId: string) =>
    api.get(`/academic/behavior/student-profile/${studentId}`, { params: { academicYearId } }),
  getAlerts: (academicYearId: string) =>
    api.get('/academic/behavior/alerts', { params: { academicYearId } }),
  getClassAnalytics: (classLevelId: string, academicYearId: string) =>
    api.get(`/academic/behavior/class-analytics/${classLevelId}`, { params: { academicYearId } }),
};

// Assessment Type endpoints
export const assessmentTypeAPI = {
  getAll: () => api.get('/assessment-types'),
  getById: (id: string) => api.get(`/assessment-types/${id}`),
  create: (data: any) => api.post('/assessment-types', data),
  update: (id: string, data: any) => api.patch(`/assessment-types/${id}`, data),
  delete: (id: string) => api.delete(`/assessment-types/${id}`),
};

// Question Bank endpoints
export const questionAPI = {
  getAll: (params?: any) => api.get('/questions', { params }),
  getById: (id: string) => api.get(`/questions/${id}`),
  create: (data: any) => api.post('/questions', data),
  update: (id: string, data: any) => api.patch(`/questions/${id}`, data),
  delete: (id: string) => api.delete(`/questions/${id}`),
  bulkImport: (questions: any[]) => api.post('/questions/bulk', { questions }),
};

// Learning Course endpoints
export const courseAPI = {
  getAll: (params?: any) => api.get('/courses', { params }),
  getById: (id: string) => api.get(`/courses/${id}`),
  create: (data: any) => api.post('/courses', data),
  update: (id: string, data: any) => api.patch(`/courses/${id}`, data),
  delete: (id: string) => api.delete(`/courses/${id}`),
  publish: (id: string) => api.post(`/courses/${id}/publish`),
  // Modules
  createModule: (courseId: string, data: any) => api.post(`/courses/${courseId}/modules`, data),
  updateModule: (id: string, data: any) => api.patch(`/modules/${id}`, data),
  deleteModule: (id: string) => api.delete(`/modules/${id}`),
  // Lessons
  createLesson: (moduleId: string, data: any) => api.post(`/modules/${moduleId}/lessons`, data),
  updateLesson: (id: string, data: any) => api.patch(`/lessons/${id}`, data),
  deleteLesson: (id: string) => api.delete(`/lessons/${id}`),
  markLessonComplete: (id: string, watchTime?: number) => api.post(`/lessons/${id}/complete`, { watchTime }),
};

// Exam endpoints
export const examAPI = {
  getAll: () => api.get('/exams'),
  getById: (id: string) => api.get(`/exams/${id}`),
  create: (data: any) => api.post('/exams', data),
  update: (id: string, data: any) => api.patch(`/exams/${id}`, data),
};

// Communication API
export const communicationAPI = {
  // Conversations
  getConversations: () => api.get('/conversations'),
  getConversation: (id: string) => api.get(`/conversations/${id}`),
  createConversation: (data: any) => api.post('/conversations', data),
  deleteConversation: (id: string) => api.delete(`/conversations/${id}`),
  // Messages
  // data can be JSON or FormData; config is optional axios config for upload progress
  sendMessage: (conversationId: string, data: any, config?: any) => api.post(`/conversations/${conversationId}/messages`, data, config),
  deleteMessage: (messageId: string) => api.delete(`/messages/${messageId}`),
  markAsRead: (conversationId: string) => api.post(`/conversations/${conversationId}/read`),
  searchMessages: (query: string, limit?: number) => api.get('/messages/search', { params: { q: query, limit } }),
  // Participants
  addParticipants: (conversationId: string, participants: any[]) => api.post(`/conversations/${conversationId}/participants`, { participants }),
  removeParticipant: (conversationId: string, participantId: string) => api.delete(`/conversations/${conversationId}/participants/${participantId}`),
};

// Role Management API
export const roleAPI = {
  getAll: () => api.get('/roles'),
  getOne: (id: string) => api.get(`/roles/${id}`),
  create: (data: any) => api.post('/roles', data),
  update: (id: string, data: any) => api.put(`/roles/${id}`, data),
  delete: (id: string) => api.delete(`/roles/${id}`),
  assign: (roleId: string, teacherId: string) => api.post(`/roles/${roleId}/assign`, { teacherId }),
  getPermissions: () => api.get('/permissions'),
};

export default api;


