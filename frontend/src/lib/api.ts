import axios from 'axios';

export const api = axios.create({
    baseURL: 'http://localhost:8080/api',
    timeout: 5000,
    withCredentials: true,
});

api.interceptors.request.use((config) => {
    if (typeof window !== 'undefined') {
        let token = localStorage.getItem('token');
        if (token && token !== 'undefined' && config.headers) {
            // 혹시라도 토큰 값 자체에 'Bearer '가 포함되어 저장된 경우 처리
            const cleanToken = token.startsWith('Bearer ') ? token.substring(7) : token;
            config.headers.Authorization = `Bearer ${cleanToken}`;
            console.log(`DEBUG: api.ts - Authorization header set (length: ${cleanToken.length})`);
        } else {
            console.log('DEBUG: api.ts - No valid token found in localStorage');
        }
    }
    return config;
});

// 응답 인터셉터 추가: 401 Unauthorized 처리
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            console.error('DEBUG: api.ts - 401 Unauthorized detected. Redirecting to login...');
            if (typeof window !== 'undefined') {
                localStorage.removeItem('token');
                localStorage.removeItem('userEmail');
                // 현재 페이지가 로그인 페이지가 아닐 때만 리다이렉트 (무한 루프 방지)
                if (!window.location.pathname.includes('/login')) {
                    window.location.href = '/login';
                }
            }
        }
        return Promise.reject(error);
    }
);
