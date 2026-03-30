"use client"

import React, { useState } from 'react'
import { api } from '@/lib/api'
import { useAuth } from '@/hooks/useAuth'

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [errorMsg, setErrorMsg] = useState('')
    const { login } = useAuth()

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const { data } = await api.post('/auth/login', { email, password })
            console.log('DEBUG: LoginPage - full response data:', JSON.stringify(data));

            // token 또는 accessToken 필드 중 있는 것을 사용 (하위 호환성)
            const receivedToken = data.token || data.accessToken;

            if (receivedToken) {
                login(receivedToken, data.email || email, data.nickname || '사용자')
            } else {
                setErrorMsg('서버로부터 유효한 토큰(`token` 또는 `accessToken` 필드)을 받지 못했습니다.')
            }
        } catch (error: any) {
            console.error('DEBUG: LoginPage - login error:', error);
            const data = error.response?.data;
            const message = typeof data === 'string' ? data : (data?.message || data?.error || '로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.');
            setErrorMsg(message);
        }
    }

    return (
        <div className="flex h-screen w-full items-center justify-center bg-gray-50">
            <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-md border border-gray-100">
                <div className="mb-10 text-center">
                    <h2 className="text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">차계부 시스템</h2>
                    <p className="text-gray-500 font-medium">당신의 차량 관리를 스마트하게 시작하세요</p>
                </div>

                {errorMsg && <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm text-center font-medium border border-red-100">{errorMsg}</div>}

                <form onSubmit={handleLogin} className="space-y-6" suppressHydrationWarning>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">이메일</label>
                        <input
                            type="email"
                            required
                            autoComplete="email"
                            suppressHydrationWarning
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            placeholder="admin@example.com"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">비밀번호</label>
                        <input
                            type="password"
                            required
                            autoComplete="current-password"
                            suppressHydrationWarning
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            placeholder="••••••••"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white font-bold py-3.5 rounded-xl hover:bg-blue-700 hover:shadow-lg transform active:scale-95 transition-all outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600"
                    >
                        안전하게 로그인
                    </button>
                </form>

                <div className="mt-8 text-center text-sm text-gray-500 font-medium">
                    계정이 없으신가요? <a href="/signup" className="text-blue-600 hover:text-blue-800 ml-1 transition-colors">회원가입하기</a>
                </div>
            </div>
        </div>
    )
}
