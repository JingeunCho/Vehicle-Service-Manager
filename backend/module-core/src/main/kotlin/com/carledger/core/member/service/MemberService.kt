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

    @Transactional
    fun updateProfile(email: String, nickname: String, phoneNumber: String?, preferredRegion: String?): Member {
        val member = getMemberByEmail(email)
        
        // 닉네임이 변경된 경우에만 중복 체크
        if (member.nickname != nickname && checkNicknameDuplicate(nickname)) {
            throw IllegalArgumentException("이미 사용 중인 닉네임입니다.")
        }
        
        member.nickname = nickname
        member.phoneNumber = phoneNumber
        member.preferredRegion = preferredRegion
        
        return member
    }
    @Transactional
    fun updatePassword(
        email: String,
        validateCurrentPassword: (String) -> Boolean,
        newEncodedPassword: String
    ) {
        val member = getMemberByEmail(email)
        if (!validateCurrentPassword(member.password)) {
            throw IllegalArgumentException("현재 비밀번호가 일치하지 않습니다.")
        }
        member.password = newEncodedPassword
    }
}
