import api from "./api";

let usersCache = null;

export const userService = {
    getAllUsers: async (forceReload = false) => {
        if (usersCache && !forceReload) return usersCache;
        const response = await api.get("/user");
        usersCache = response.data;
        return usersCache;
    },

    getUserById: async (id) => {
        const response = await api.get(`/user/${id}`);
        return response.data;
    },

    createUser: async (userData) => {
        const response = await api.post("/user", userData);
        usersCache = null; // Invalidate cache
        return response.data;
    },

    updateUser: async (id, userData) => {
        const response = await api.put(`/user/${id}`, userData);
        usersCache = null; // Invalidate cache
        return response.data;
    },

    deleteUser: async (id) => {
        const response = await api.delete(`/user/${id}`);
        usersCache = null; // Invalidate cache
        return response.data;
    },
};

