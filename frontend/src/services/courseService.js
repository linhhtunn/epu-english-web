import api from './api';

let coursesCache = null;

export const courseService = {
    getAllCourses: async (forceReload = false) => {
        if (coursesCache && !forceReload) return coursesCache;
        const response = await api.get('/course');
        coursesCache = response.data;
        return coursesCache;
    },
    
    getCourseById: async (id) => {
        const response = await api.get(`/course/${id}`);
        return response.data;
    },
    
    createCourse: async (courseData) => {
        const response = await api.post('/course', courseData);
        coursesCache = null;
        return response.data;
    },
    
    updateCourse: async (id, courseData) => {
        const response = await api.put(`/course/${id}`, courseData);
        coursesCache = null;
        return response.data;
    },
    
    deleteCourse: async (id) => {
        const response = await api.delete(`/course/${id}`);
        coursesCache = null;
        return response.data;
    }
};
