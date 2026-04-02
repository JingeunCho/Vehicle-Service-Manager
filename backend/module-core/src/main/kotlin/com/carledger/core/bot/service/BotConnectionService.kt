package com.carledger.core.bot.service

import com.carledger.core.bot.domain.BotConnection
import com.carledger.core.bot.domain.PlatformType
import com.carledger.core.bot.repository.BotConnectionRepository
import com.carledger.core.member.domain.Member
import com.carledger.core.member.service.MemberService
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.Instant
import java.time.temporal.ChronoUnit
import java.util.UUID

@Service
@Transactional(readOnly = true)
class BotConnectionService(
    private val botConnectionRepository: BotConnectionRepository,
    private val memberService: MemberService
) {

    @Transactional
    fun generateOtpToken(memberEmail: String, platformType: PlatformType): String {
        val member = memberService.getMemberByEmail(memberEmail)
        
        // 간단한 8자리 영문자+숫자 OTP 생성
        val otpToken = UUID.randomUUID().toString().substring(0, 8).uppercase()
        
        val botConnection = BotConnection(
            member = member,
            platformType = platformType,
            otpToken = otpToken,
            isVerified = false,
            expiresAt = Instant.now().plusSeconds(600) // 10 minutes
        )
        
        botConnectionRepository.save(botConnection)
        return otpToken
    }

    @Transactional
    fun verifyOtpToken(
        otpToken: String, 
        platformUserId: String,
        email: String,
        validatePassword: (String) -> Boolean
    ): BotConnection {
        val botConnection = botConnectionRepository.findByOtpTokenAndIsDeletedFalse(otpToken)
            ?: throw IllegalArgumentException("유효하지 않은 OTP 토큰입니다.")
        
        if (botConnection.isVerified) {
            throw IllegalArgumentException("이미 인증이 완료된 토큰입니다.")
        }
        
        if (botConnection.expiresAt != null && botConnection.expiresAt!!.isBefore(Instant.now())) {
            throw IllegalArgumentException("만료된 OTP 토큰입니다. 대시보드에서 코드를 재발급해 주세요.")
        }

        // 이메일 일치 확인
        if (botConnection.member.email != email) {
            throw IllegalArgumentException("이메일 정보가 발급된 OTP와 일치하지 않습니다.")
        }
        
        // 비밀번호 검증 (암호화된 비밀번호 비교는 호출부에서 람다로 전달)
        if (!validatePassword(botConnection.member.password)) {
            throw IllegalArgumentException("비밀번호가 올바르지 않습니다.")
        }
            
        botConnection.isVerified = true
        botConnection.platformUserId = platformUserId
        // 인증 완료 시 30일간 연동 유지
        botConnection.expiresAt = Instant.now().plus(30, ChronoUnit.DAYS)
        
        return botConnection
    }

    fun getMemberByPlatformUserId(platformUserId: String, platformType: PlatformType): Member {
        val connection = botConnectionRepository.findByPlatformUserIdAndPlatformTypeAndIsDeletedFalse(platformUserId, platformType)
            ?: throw IllegalArgumentException("연동된 계정을 찾을 수 없습니다. 웹 대시보드에서 발급받은 /start [OTP] 코드를 먼저 전송해 주세요.")
        
        return connection.member
    }

    fun isLinkedByEmail(email: String, platformType: PlatformType): Boolean {
        return botConnectionRepository.findAllByMemberEmailAndPlatformTypeAndIsDeletedFalse(email, platformType)
            .any { it.isVerified && (it.expiresAt == null || it.expiresAt!!.isAfter(Instant.now())) }
    }

    fun findLatestOtp(email: String, platformType: PlatformType): String? {
        return botConnectionRepository.findAllByMemberEmailAndPlatformTypeAndIsDeletedFalse(email, platformType)
            .filter { !it.isVerified }
            .maxByOrNull { it.id }
            ?.otpToken
    }
}
