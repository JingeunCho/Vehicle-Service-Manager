"use client"

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export const useAuth = () => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const [userEmail, setUserEmail] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const email = localStorage.getItem('userEmail');
        if (token) {
            setIsAuthenticated(true);
            setUserEmail(email);
        } else {
            setIsAuthenticated(false);
            router.push('/login');
        }
    }, [router]);

    const login = (token: string, email: string) => {
        localStorage.setItem('token', token);
        localStorage.setItem('userEmail', email);
        console.log('DEBUG: useAuth - token saved to localStorage');
        setIsAuthenticated(true);
        setUserEmail(email);

        // 리다이렉트 전 아주 약간의 지연을 더 주어 localStorage 반영 보장
        setTimeout(() => {
            window.location.href = '/'; // router.push 대신 강제 새로고침으로 상태 초기화
        }, 100);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userEmail');
        setIsAuthenticated(false);
        router.push('/login');
    };

    return { isAuthenticated, userEmail, login, logout };
};
