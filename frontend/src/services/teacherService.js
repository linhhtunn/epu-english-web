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
    }
};
