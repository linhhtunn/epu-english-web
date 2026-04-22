import axios from "axios";

const AUTH_SESSION_KEY = "auth_session";

const getStoredSession = () => {
    const raw = localStorage.getItem(AUTH_SESSION_KEY);
    if (!raw) {
        return null;
    }

    try {
        return JSON.parse(raw);
    } catch {
        localStorage.removeItem(AUTH_SESSION_KEY);
        return null;
    }
};

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:64179/api",
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use(
    (config) => {
        const session = getStoredSession();
        if (session?.token) {
            config.headers.Authorization = `Bearer ${session.token}`;
        }

        return config;
    },
    (error) => Promise.reject(error),
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (
            error.response &&
            (error.response.status === 401 || error.response.status === 403)
        ) {
            localStorage.removeItem(AUTH_SESSION_KEY);

            if (window.location.pathname !== "/login") {
                window.location.href = "/login";
            }
        }

        return Promise.reject(error);
    },
);

export default api;
