import api from './api';

/**
 * Lấy danh sách buổi học của giáo viên theo ngày
 * @param {number} teacherId - Mã giáo viên
 * @param {string} date - Ngày học (yyyy-MM-dd), mặc định hôm nay
 */
export const getSessions = (teacherId, date) => {
    const params = { teacherId };
    if (date) params.date = date;
    return api.get('/Attendance/sessions', { params });
};

/**
 * Lấy danh sách học sinh trong buổi học kèm trạng thái điểm danh
 * @param {number} sessionId - Mã buổi học
 */
export const getStudentsInSession = (sessionId) =>
    api.get(`/Attendance/sessions/${sessionId}/students`);

/**
 * Lưu/cập nhật điểm danh hàng loạt
 * @param {number} sessionId - Mã buổi học
 * @param {Array} records - [{ maHocSinh, trangThai }]
 */
export const saveAttendance = (sessionId, records) =>
    api.post(`/Attendance/sessions/${sessionId}/save`, records);

/**
 * Lấy tổng hợp điểm danh của học sinh trong một lớp
 * @param {number} classId - Mã lớp
 */
export const getAttendanceSummary = (classId) =>
    api.get(`/Attendance/summary/${classId}`);
