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

    getRescheduleOptions: async () => {
        const response = await api.get("/teacher/reschedule-options");
        return response.data;
    },

    getRescheduleRequests: async () => {
        const response = await api.get("/teacher/reschedule-requests");
        return response.data;
    },

    createRescheduleRequest: async (payload) => {
        const response = await api.post("/teacher/reschedule-requests", payload);
        return response.data;
    }
};
