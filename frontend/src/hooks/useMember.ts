import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';

export interface MemberProfile {
    id: number;
    email: string;
    nickname: string;
    phoneNumber: string | null;
    preferredRegion: string | null;
    isDarkMode: boolean;
    telegramBotToken: string | null;
}

export interface MemberUpdateRequest {
    nickname: string;
    phoneNumber: string | null;
    preferredRegion: string | null;
}

export const useMemberProfile = () => {
    return useQuery<MemberProfile>({
        queryKey: ['members', 'me'],
        queryFn: async () => {
            const { data } = await api.get('/members/me');
            return data;
        },
    });
};

export const useUpdateProfile = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (request: MemberUpdateRequest) => {
            const { data } = await api.put('/members/me', request);
            return data;
        },
        onSuccess: (data) => {
            queryClient.setQueryData(['members', 'me'], data);
            // Update localStorage for Sidebar sync
            localStorage.setItem('nickname', data.nickname);
        },
    });
};

export const useUpdatePassword = () => {
    return useMutation({
        mutationFn: async (request: any) => {
            const { data } = await api.put('/members/me/password', request);
            return data;
        },
    });
};
