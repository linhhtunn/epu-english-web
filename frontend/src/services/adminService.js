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

    getScheduleOptions: async () => {
        const response = await api.get("/admin/schedule/options");
        return response.data;
    },

    getAvailability: async (maLop, ngayHoc, maGiaoVien) => {
        const response = await api.get("/admin/schedule/availability", {
            params: {
                maLop,
                ngayHoc,
                maGiaoVien,
            },
        });
        return response.data;
    },

    createManualSchedule: async (payload) => {
        const response = await api.post("/admin/schedule/manual", payload);
        return response.data;
    },

    createAutoSchedule: async (payload) => {
        const response = await api.post("/admin/schedule/auto", payload);
        return response.data;
    },

    processRescheduleRequest: async (requestId, payload) => {
        const response = await api.post(`/admin/reschedule-requests/${requestId}/process`, payload);
        return response.data;
    }
};
