import api from './api';

let classesCache = null;

export const classService = {
    getAllClasses: async (forceReload = false) => {
        if (classesCache && !forceReload) return classesCache;
        const response = await api.get('/class');
        classesCache = response.data;
        return classesCache;
    },
    
    getClassById: async (id) => {
        const response = await api.get(`/class/${id}`);
        return response.data;
    },
    
    createClass: async (classData) => {
        const response = await api.post('/class', classData);
        classesCache = null;
        return response.data;
    },
    
    updateClass: async (id, classData) => {
        const response = await api.put(`/class/${id}`, classData);
        classesCache = null;
        return response.data;
    },
    
    deleteClass: async (id) => {
        const response = await api.delete(`/class/${id}`);
        classesCache = null;
        return response.data;
    },

    assignStudent: async (classId, studentId) => {
        const response = await api.post(`/class/${classId}/assignStudent/${studentId}`);
        return response.data;
    }
};

