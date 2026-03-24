package com.carledger.web.domain.member.dto

import com.carledger.core.member.domain.Member
import com.carledger.core.member.domain.MemberSettings

data class MemberResponse(
    val id: Long,
    val email: String,
    val nickname: String,
    val preferredRegion: String?,
    val isDarkMode: Boolean,
    val telegramBotToken: String?
) {
    companion object {
        fun of(member: Member, settings: MemberSettings?): MemberResponse {
            return MemberResponse(
                id = member.id,
                email = member.email,
                nickname = member.nickname,
                preferredRegion = member.preferredRegion,
                isDarkMode = settings?.isDarkMode ?: false,
                telegramBotToken = settings?.telegramBotToken
            )
        }
    }
}
