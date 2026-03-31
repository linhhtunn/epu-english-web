import api from './api';

/**
 * Lấy danh sách con của phụ huynh (dựa vào profileId = maPhuHuynh)
 */
export const getChildren = (parentId) =>
    api.get(`/Parent/${parentId}/children`);

/**
 * Lấy lịch sử điểm danh của một học sinh
 * GET /api/Attendance/student/{studentId}
 */
export const getStudentAttendance = (studentId) =>
    api.get(`/Attendance/student/${studentId}`);

/**
 * Lấy thống kê điểm danh của học sinh trong tất cả lớp
 */
export const getStudentAttendanceSummary = (studentId) =>
    api.get(`/Attendance/student/${studentId}/summary`);
