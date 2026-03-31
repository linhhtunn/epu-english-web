import api from './api';

/**
 * Lấy thống kê tổng quan cho Admin Dashboard
 */
export const getAdminStats = () => api.get('/Admin/stats');

/**
 * Lấy danh sách buổi học hôm nay cho Admin
 */
export const getSessionsToday = () => api.get('/Admin/sessions-today');
