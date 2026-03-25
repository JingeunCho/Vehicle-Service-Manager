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
