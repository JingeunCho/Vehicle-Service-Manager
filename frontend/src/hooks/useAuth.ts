"use client"

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export const useAuth = () => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const [userEmail, setUserEmail] = useState<string | null>(null);
    const [nickname, setNickname] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const email = localStorage.getItem('userEmail');
        const nick = localStorage.getItem('nickname');
        if (token) {
            setIsAuthenticated(true);
            setUserEmail(email);
            setNickname(nick);
        } else {
            setIsAuthenticated(false);
            router.push('/login');
        }
    }, [router]);

    const login = (token: string, email: string, nick: string) => {
        localStorage.setItem('token', token);
        localStorage.setItem('userEmail', email);
        localStorage.setItem('nickname', nick);
        console.log('DEBUG: useAuth - info saved to localStorage');
        setIsAuthenticated(true);
        setUserEmail(email);
        setNickname(nick);

        // 리다이렉트 전 아주 약간의 지연을 더 주어 localStorage 반영 보장
        setTimeout(() => {
            window.location.href = '/';
        }, 100);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('nickname');
        setIsAuthenticated(false);
        router.push('/login');
    };

    return { isAuthenticated, userEmail, nickname, login, logout };
};
