package com.carledger.core.member.service

import com.carledger.core.member.domain.Member
import com.carledger.core.member.domain.MemberSettings
import com.carledger.core.member.repository.MemberRepository
import com.carledger.core.member.repository.MemberSettingsRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
@Transactional(readOnly = true)
class MemberService(
    private val memberRepository: MemberRepository,
    private val memberSettingsRepository: MemberSettingsRepository
) {

    fun getMemberByEmail(email: String): Member {
        return memberRepository.findByEmailAndIsDeletedFalse(email)
            ?: throw IllegalArgumentException("Member not found with email: \$email")
    }

    fun checkEmailDuplicate(email: String): Boolean {
        return memberRepository.existsByEmailAndIsDeletedFalse(email)
    }

    fun checkNicknameDuplicate(nickname: String): Boolean {
        return memberRepository.existsByNicknameAndIsDeletedFalse(nickname)
    }

    @Transactional
    fun signup(email: String, encodedPassword: String, nickname: String, preferredRegion: String?): Member {
        if (checkEmailDuplicate(email)) throw IllegalArgumentException("Email already in use")
        if (checkNicknameDuplicate(nickname)) throw IllegalArgumentException("Nickname already in use")

        val member = Member(
            email = email,
            password = encodedPassword,
            nickname = nickname,
            preferredRegion = preferredRegion
        )
        val savedMember = memberRepository.save(member)

        val settings = MemberSettings(
            member = savedMember,
            isDarkMode = false
        )
        memberSettingsRepository.save(settings)

        return savedMember
    }
    
    fun getMemberSettings(memberId: Long): MemberSettings? {
        return memberSettingsRepository.findByMemberId(memberId)
    }
}
