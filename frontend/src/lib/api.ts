import axios from 'axios';

export const api = axios.create({
    baseURL: 'http://localhost:8080/api',
    timeout: 5000,
});

api.interceptors.request.use((config) => {
    // 클라이언트 사이드에서만 로컬 스토리지에 접근
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        if (token && config.headers) {
            // Spring Boot의 JWT 토큰 검증은 Bearer를 사용
            config.headers.Authorization = `Bearer \${token}`;
        }
    }
    return config;
});
