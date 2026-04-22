import api from "./api";

export const parentService = {
    getChildrenDashboard: async () => {
        const response = await api.get("/parent/dashboard");
        return response.data;
    },

    getChildSchedule: async (studentId, fromDate, toDate) => {
        const response = await api.get(`/parent/child-schedule/${studentId}`, {
            params: {
                fromDate,
                toDate,
            },
        });
        return response.data;
    },

    getAttendance: async (studentId) => {
        const response = await api.get(`/parent/attendance/${studentId}`);
        return response.data;
    }
};
