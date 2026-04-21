import api from "./api";

export const adminService = {
    getDashboard: async () => {
        const response = await api.get("/admin/dashboard");
        return response.data;
    },

    getSchedule: async (fromDate, toDate) => {
        const response = await api.get("/admin/schedule", {
            params: {
                fromDate,
                toDate,
            },
        });
        return response.data;
    }
};
