"use client"

import React, { useState, useEffect } from 'react'
import { useMemberProfile, useUpdateProfile } from '@/hooks/useMember'
import { useTelegramStatus, useGenerateTelegramOtp } from '@/hooks/useDashboard'
import {
    User,
    Mail,
    Phone,
    MapPin,
    Send,
    Copy,
    Check,
    ExternalLink,
    Save,
    ShieldCheck,
    MessageSquare,
    Lock,
    AlertCircle,
    X
} from 'lucide-react'
import { useUpdatePassword } from '@/hooks/useMember'

// Password Change Modal Component
function PasswordModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
    const { mutate: updatePassword, isPending: isPasswordUpdating } = useUpdatePassword()

    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [passwordError, setPasswordError] = useState('')
    const [passwordSuccess, setPasswordSuccess] = useState(false)

    const handleUpdatePassword = (e: React.FormEvent) => {
        e.preventDefault()
        setPasswordError('')
        setPasswordSuccess(false)

        if (newPassword !== confirmPassword) {
            setPasswordError('새 비밀번호와 확인 비밀번호가 일치하지 않습니다.')
            return
        }

        if (newPassword.length < 8) {
            setPasswordError('비밀번호는 최소 8자 이상이어야 합니다.')
            return
        }

        updatePassword({
            currentPassword,
            newPassword,
            confirmPassword
        }, {
            onSuccess: () => {
                setPasswordSuccess(true)
                setCurrentPassword('')
                setNewPassword('')
                setConfirmPassword('')
                setTimeout(() => {
                    setPasswordSuccess(false)
                    onClose()
                }, 1500)
            },
            onError: (error: any) => {
                const message = error.response?.data?.message || error.message || '비밀번호 변경에 실패했습니다.'
                setPasswordError(message)
            }
        })
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-md rounded-3xl p-8 shadow-2xl relative animate-in zoom-in-95 duration-200">
                <button
                    onClick={onClose}
                    className="absolute right-6 top-6 text-gray-400 hover:text-gray-600 transition"
                >
                    <X className="w-6 h-6" />
                </button>

                <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 bg-red-50 text-red-600 rounded-xl flex items-center justify-center">
                        <Lock className="w-5 h-5" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800">비밀번호 변경</h3>
                </div>

                <form onSubmit={handleUpdatePassword} className="space-y-6">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-xs font-black text-gray-400 uppercase tracking-wider ml-1">현재 비밀번호</label>
                            <input
                                type="password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                className="w-full bg-white border border-gray-200 px-4 py-3 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-red-100 focus:border-red-500 outline-none transition-all"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black text-gray-400 uppercase tracking-wider ml-1">새 비밀번호</label>
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full bg-white border border-gray-200 px-4 py-3 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                                placeholder="새 비밀번호 입력"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black text-gray-400 uppercase tracking-wider ml-1">새 비밀번호 확인</label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full bg-white border border-gray-200 px-4 py-3 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                                placeholder="다시 한번 입력"
                                required
                            />
                        </div>
                    </div>

                    {passwordError && (
                        <div className="flex items-center gap-2 text-red-600 text-xs font-bold bg-red-50 p-4 rounded-2xl border border-red-100 animate-in fade-in slide-in-from-top-2 duration-200">
                            <AlertCircle className="w-4 h-4" /> {passwordError}
                        </div>
                    )}

                    {passwordSuccess && (
                        <div className="flex items-center gap-2 text-green-600 text-xs font-bold bg-green-50 p-4 rounded-2xl border border-green-100 animate-in fade-in slide-in-from-top-2 duration-200">
                            <Check className="w-4 h-4" /> 비밀번호가 성공적으로 변경되었습니다.
                        </div>
                    )}

                    <div className="pt-2 flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 bg-gray-50 text-gray-500 py-3.5 rounded-2xl text-sm font-black hover:bg-gray-100 transition active:scale-95"
                        >
                            취소
                        </button>
                        <button
                            type="submit"
                            disabled={isPasswordUpdating}
                            className="flex-1 bg-gray-900 text-white py-3.5 rounded-2xl text-sm font-black hover:bg-black transition shadow-lg shadow-gray-900/20 active:scale-95 disabled:opacity-50"
                        >
                            {isPasswordUpdating ? '변경 중...' : '변경 완료'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default function SettingsPage() {
    const { data: profile, isLoading: isProfileLoading } = useMemberProfile()
    const { mutate: updateProfile, isPending: isUpdating } = useUpdateProfile()
    const { data: telegramStatus, refetch: refetchTelegramStatus } = useTelegramStatus()
    const { generate: generateOtp } = useGenerateTelegramOtp()

    const [nickname, setNickname] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [preferredRegion, setPreferredRegion] = useState('')

    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false)
    const [isGeneratingOtp, setIsGeneratingOtp] = useState(false)
    const [copied, setCopied] = useState(false)
    const [saveSuccess, setSaveSuccess] = useState(false)

    useEffect(() => {
        if (profile) {
            setNickname(profile.nickname || '')
            setPhoneNumber(profile.phoneNumber || '')
            setPreferredRegion(profile.preferredRegion || '')
        }
    }, [profile])

    const handleUpdateProfile = (e: React.FormEvent) => {
        e.preventDefault()
        updateProfile({
            nickname,
            phoneNumber: phoneNumber || null,
            preferredRegion: preferredRegion || null
        }, {
            onSuccess: () => {
                setSaveSuccess(true)
                setTimeout(() => setSaveSuccess(false), 3000)
            }
        })
    }

    const handleGenerateOtp = async () => {
        setIsGeneratingOtp(true)
        try {
            await generateOtp()
            refetchTelegramStatus()
        } finally {
            setIsGeneratingOtp(false)
        }
    }

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    if (isProfileLoading) return <div className="p-8 text-center text-gray-500">사용자 설정을 불러오는 중입니다...</div>

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-10">
            <header className="mb-2">
                <h2 className="text-3xl font-black text-gray-900 tracking-tight">설정 및 서비스 연동</h2>
                <p className="text-gray-500 font-medium mt-1">개인정보 관리 및 외부 서비스(봇) 연동을 설정합니다.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Profile Section */}
                <div className="lg:col-span-2 space-y-6">
                    <section className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between gap-3 mb-8">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                                    <User className="w-5 h-5" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-800">개인정보 수정</h3>
                            </div>
                            <button
                                onClick={() => setIsPasswordModalOpen(true)}
                                className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition active:scale-95"
                            >
                                <Lock className="w-4 h-4" /> 비밀번호 변경
                            </button>
                        </div>

                        <form onSubmit={handleUpdateProfile} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-wider ml-1">이메일 계정</label>
                                    <div className="flex items-center gap-3 bg-gray-50 border border-gray-100 px-4 py-3 rounded-2xl text-gray-500 cursor-not-allowed">
                                        <Mail className="w-4 h-4" />
                                        <span className="text-sm font-semibold">{profile?.email}</span>
                                        <ShieldCheck className="w-4 h-4 ml-auto text-green-500" />
                                    </div>
                                    <p className="text-[10px] text-gray-400 ml-1 mt-1">* 이메일은 변경할 수 없습니다.</p>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-wider ml-1">사용자 닉네임</label>
                                    <input
                                        type="text"
                                        value={nickname}
                                        onChange={(e) => setNickname(e.target.value)}
                                        className="w-full bg-white border border-gray-200 px-4 py-3 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                                        placeholder="이름 또는 닉네임"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-wider ml-1">전화번호</label>
                                    <div className="relative">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                            <Phone className="w-4 h-4" />
                                        </div>
                                        <input
                                            type="tel"
                                            value={phoneNumber}
                                            onChange={(e) => setPhoneNumber(e.target.value)}
                                            className="w-full bg-white border border-gray-200 pl-11 pr-4 py-3 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                                            placeholder="예: 010-1234-5678"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-wider ml-1">우선 지역 (선택)</label>
                                    <div className="relative">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                            <MapPin className="w-4 h-4" />
                                        </div>
                                        <input
                                            type="text"
                                            value={preferredRegion}
                                            onChange={(e) => setPreferredRegion(e.target.value)}
                                            className="w-full bg-white border border-gray-200 pl-11 pr-4 py-3 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                                            placeholder="예: 서울특별시"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    {saveSuccess && (
                                        <span className="text-green-600 text-sm font-bold animate-in fade-in slide-in-from-left-2 duration-300 flex items-center gap-1">
                                            <Check className="w-4 h-4" /> 정보가 저장성공 되었습니다.
                                        </span>
                                    )}
                                </div>
                                <button
                                    type="submit"
                                    disabled={isUpdating}
                                    className="flex items-center gap-2 bg-blue-600 text-white px-8 py-3.5 rounded-2xl text-sm font-black hover:bg-blue-700 transition shadow-lg shadow-blue-600/20 active:scale-95 disabled:opacity-50"
                                >
                                    {isUpdating ? '저장 중...' : (
                                        <>
                                            <Save className="w-4 h-4" /> 설정 저장하기
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </section>
                </div>

                <div className="space-y-6">
                    <section className="bg-gray-900 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden group">
                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
                                    <Send className="w-5 h-5 text-white" />
                                </div>
                                <h3 className="text-lg font-bold">텔레그램 봇 연동</h3>
                            </div>

                            <div className="space-y-6">
                                {telegramStatus?.isLinked ? (
                                    <div className="bg-green-400/20 border border-green-400/30 p-4 rounded-2xl">
                                        <div className="flex items-center gap-2 mb-1">
                                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                                            <span className="text-sm font-bold">연동 활성화됨</span>
                                        </div>
                                        <p className="text-[11px] text-white/60">텔레그램 대화창에서 자유롭게 차계부를 기록할 수 있습니다.</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <p className="text-xs text-white/70 leading-relaxed font-medium">
                                            텔레그램 봇(`/start [OTP]`)에 아래 코드를 전송하여 웹 계정과 연동하세요.
                                        </p>

                                        {telegramStatus?.otp ? (
                                            <div className="space-y-3">
                                                <div className="bg-white/10 border border-white/20 px-4 py-3 rounded-2xl text-center font-mono font-bold tracking-widest text-blue-300">
                                                    /start {telegramStatus.otp}
                                                </div>
                                                <button
                                                    onClick={() => copyToClipboard(`/start ${telegramStatus.otp}`)}
                                                    className="w-full flex items-center justify-center gap-2 bg-white text-gray-900 py-3 rounded-2xl text-sm font-black hover:bg-blue-50 transition active:scale-95"
                                                >
                                                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                                                    {copied ? '복사됨' : '명령어 복사하기'}
                                                </button>
                                                <p className="text-[9px] text-white/40 text-center">* 발급된 코드는 10분간 유효합니다.</p>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={handleGenerateOtp}
                                                disabled={isGeneratingOtp}
                                                className="w-full bg-blue-600 text-white py-4 rounded-2xl text-sm font-black hover:bg-blue-500 transition active:scale-95 disabled:opacity-50"
                                            >
                                                {isGeneratingOtp ? '생성 중...' : '연동 코드 발급받기'}
                                            </button>
                                        )}
                                    </div>
                                )}

                                <a
                                    href="https://t.me/KR_CM_bot"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl bg-white/5 border border-white/10 text-white/80 hover:bg-white/10 hover:text-white transition text-xs font-bold"
                                >
                                    텔레그램 봇 바로가기 <ExternalLink className="w-3.5 h-3.5" />
                                </a>
                            </div>
                        </div>
                        <div className="absolute -right-20 -bottom-20 w-40 h-40 bg-blue-600 rounded-full blur-[80px] opacity-30 group-hover:opacity-50 transition duration-700" />
                    </section>

                    <section className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                        <div className="flex items-center gap-2 mb-4">
                            <MessageSquare className="w-4 h-4 text-gray-400" />
                            <h4 className="text-sm font-bold text-gray-700">추가 연동 안내</h4>
                        </div>
                        <div className="space-y-4 opacity-50 filter grayscale grayscale-0">
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl border border-gray-100">
                                <span className="text-xs font-bold text-gray-500">Discord</span>
                                <span className="text-[10px] bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full font-black uppercase">Coming Soon</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl border border-gray-100">
                                <span className="text-xs font-bold text-gray-500">Kakaotalk</span>
                                <span className="text-[10px] bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full font-black uppercase">Coming Soon</span>
                            </div>
                        </div>
                    </section>
                </div>
            </div>

            <PasswordModal
                isOpen={isPasswordModalOpen}
                onClose={() => setIsPasswordModalOpen(false)}
            />
        </div>
    )
}
