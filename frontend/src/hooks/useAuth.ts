"use client"

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export const useAuth = () => {
    // [TODO/임시] 백엔드 서버가 꺼져있는 환경에서도 UI를 확인해야 하므로 강제로 true 할당!
    // 추후 다시 백엔드가 켜져서 로그인 기반으로 동작할 땐 원래대로 null(초기값)로 원복해야 합니다.
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(true);
    const [userEmail, setUserEmail] = useState<string | null>('admin@temporary.com');
    const router = useRouter();

    useEffect(() => {
        // [TODO/임시] 로그인 미인증 시 강제로 Login 화면으로 보내는 리디렉션 주석 처리 (해제 시 원래대로 복구됨)
        /*
        const token = localStorage.getItem('token');
        const email = localStorage.getItem('userEmail');
        if (token) {
            setIsAuthenticated(true);
            setUserEmail(email);
        } else {
            setIsAuthenticated(false);
            router.push('/login');
        }
        */
    }, [router]);

    const login = (token: string, email: string) => {
        localStorage.setItem('token', token);
        localStorage.setItem('userEmail', email);
        setIsAuthenticated(true);
        router.push('/');
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userEmail');
        setIsAuthenticated(false);
        router.push('/login');
    };

    return { isAuthenticated, userEmail, login, logout };
};
