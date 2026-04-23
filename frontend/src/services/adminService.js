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
    },

    getScheduleClasses: async () => {
        const response = await api.get("/admin/schedule/classes");
        return response.data;
    },

    createSession: async (data) => {
        const response = await api.post("/admin/schedule/session", data);
        return response.data;
    },

    updateSession: async (id, data) => {
        const response = await api.put(`/admin/schedule/session/${id}`, data);
        return response.data;
    },

    deleteSession: async (id) => {
        const response = await api.delete(`/admin/schedule/session/${id}`);
        return response.data;
    }
};
