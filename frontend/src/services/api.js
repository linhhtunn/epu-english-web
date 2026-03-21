import axios from 'axios';

// Tạo một instance của axios
const api = axios.create({
    // Đảm bảo Port khớp với launchSettings.json của Backend C# (HTTP là 64179)
    baseURL: 'http://localhost:64179/api', 
    headers: {
        'Content-Type': 'application/json'
    }
});

// Interceptor cho Request: Gửi kèm Token lên Server
api.interceptors.request.use(
    (config) => {
        // Vì chúng ta lưu cả object user vào localStorage, nên cần parse ra để lấy token
        const userData = localStorage.getItem('user');
        if (userData) {
            const { token } = JSON.parse(userData);
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Interceptor cho Response: Xử lý các lỗi Global
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Nếu lỗi 401 (Hết hạn token hoặc chưa đăng nhập) hoặc 403 (Không có quyền)
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            localStorage.removeItem('user'); // Chỉ xóa user, tránh clear toàn bộ nếu có app khác
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;