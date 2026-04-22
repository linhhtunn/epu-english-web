import api from "./api";

export const teacherService = {
    getDashboard: async () => {
        const response = await api.get("/teacher/dashboard");
        return response.data;
    },

    getSchedule: async (fromDate, toDate) => {
        const response = await api.get("/teacher/schedule", {
            params: {
                fromDate,
                toDate,
            },
        });
        return response.data;
    },

    getClasses: async () => {
        const response = await api.get("/teacher/classes");
        return response.data;
    },

    getTodayClasses: async () => {
        const response = await api.get("/teacher/today-classes");
        return response.data;
    },

    saveAttendance: async (maBuoiHoc, students) => {
        const response = await api.post("/teacher/attendance", {
            maBuoiHoc,
            students,
        });
        return response.data;
    },

    getHomeworkTemplates: async () => {
        const response = await api.get("/teacher/homework-templates");
        return response.data;
    },

    getAssignedHomeworks: async () => {
        const response = await api.get("/teacher/assigned-homeworks");
        return response.data;
    },

    assignHomework: async (data) => {
        const response = await api.post("/teacher/assign-homework", data);
        return response.data;
    },

    publishHomework: async (id) => {
        const response = await api.put(`/teacher/homeworks/${id}/publish`);
        return response.data;
    },

    getHomeworkDetails: async (id) => {
        const response = await api.get(`/teacher/homeworks/${id}/details`);
        return response.data;
    },

    getSubmissions: async () => {
        const response = await api.get("/teacher/submissions");
        return response.data;
    },

    gradeSubmission: async (submissionId, data) => {
        const response = await api.put(
            `/teacher/submissions/${submissionId}/grade`,
            data,
        );
        return response.data;
    },
    getStudentProgress: async (studentId, classId) => {
        const response = await api.get(`/teacher/students/${studentId}/progress`, {
            params: { classId },
        });
        return response.data;
    },
};
