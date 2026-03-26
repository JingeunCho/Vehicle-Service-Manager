"use client"

import React, { useState } from 'react'
import { api } from '@/lib/api'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function SignupPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [nickname, setNickname] = useState('')
    const [errorMsg, setErrorMsg] = useState('')
    const router = useRouter()

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            await api.post('/auth/signup', { email, password, nickname })
            alert('회원가입이 완료되었습니다. 로그인해주세요.')
            router.push('/login')
        } catch (error: any) {
            const data = error.response?.data;
            const message = typeof data === 'string' ? data : (data?.message || data?.error || '회원가입 처리 중 에러가 발생했습니다.');
            setErrorMsg(message);
        }
    }

    return (
        <div className="flex h-screen w-full items-center justify-center bg-gray-50">
            <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-md border border-gray-100">
                <div className="mb-10 text-center">
                    <h2 className="text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">회원가입</h2>
                    <p className="text-gray-500 font-medium">차계부에 오신 것을 환영합니다</p>
                </div>

                {errorMsg && <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm text-center font-medium border border-red-100">{errorMsg}</div>}

                <form onSubmit={handleSignup} className="space-y-5">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">이메일</label>
                        <input
                            type="email"
                            required
                            suppressHydrationWarning
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            placeholder="admin@example.com"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">닉네임 (별명)</label>
                        <input
                            type="text"
                            required
                            suppressHydrationWarning
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                            value={nickname}
                            onChange={e => setNickname(e.target.value)}
                            placeholder="홍길동"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">비밀번호</label>
                        <input
                            type="password"
                            required
                            suppressHydrationWarning
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            placeholder="••••••••"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white font-bold py-3.5 rounded-xl hover:bg-blue-700 hover:shadow-lg transform active:scale-95 transition-all outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 mt-2"
                    >
                        무료로 시작하기
                    </button>
                </form>

                <div className="mt-8 text-center text-sm text-gray-500 font-medium">
                    이미 계정이 있으신가요? <Link href="/login" className="text-blue-600 hover:text-blue-800 ml-1 transition-colors">로그인하기</Link>
                </div>
            </div>
        </div>
    )
}
