import api from "./api";

export const studentService = {
    getDashboard: async (studentId) => {
        const response = await api.get(`/student/${studentId}/dashboard`);
        return response.data;
    },

    getSchedule: async (studentId, fromDate, toDate) => {
        const response = await api.get(`/student/${studentId}/schedule`, {
            params: {
                fromDate,
                toDate,
            },
        });
        return response.data;
    },

    getHomeworks: async (studentId) => {
        const response = await api.get(`/student/${studentId}/homeworks`);
        return response.data;
    },

    getHomeworkDetail: async (studentId, homeworkId) => {
        const response = await api.get(
            `/student/${studentId}/homeworks/${homeworkId}`,
        );
        return response.data;
    },

    getReports: async (studentId) => {
        const response = await api.get(`/student/${studentId}/reports`);
        return response.data;
    },

    getNotifications: async () => {
        const response = await api.get("/student/notifications");
        return response.data;
    },

    markNotificationAsRead: async (notificationId) => {
        const response = await api.put(
            `/student/notifications/${notificationId}/read`,
        );
        return response.data;
    },

    submitHomework: async (studentId, homeworkId, data) => {
        const response = await api.post(
            `/student/${studentId}/homeworks/${homeworkId}/submit`,
            data,
        );
        return response.data;
    },
};
