package com.carledger.core.bot.service

import com.carledger.core.bot.domain.BotConnection
import com.carledger.core.bot.domain.PlatformType
import com.carledger.core.bot.repository.BotConnectionRepository
import com.carledger.core.member.domain.Member
import com.carledger.core.member.service.MemberService
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
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
            isVerified = false
        )
        
        botConnectionRepository.save(botConnection)
        return otpToken
    }

    @Transactional
    fun verifyOtpToken(otpToken: String, platformUserId: String): BotConnection {
        val botConnection = botConnectionRepository.findByOtpTokenAndIsDeletedFalse(otpToken)
            ?: throw IllegalArgumentException("Invalid or expired OTP Token")
            
        botConnection.isVerified = true
        botConnection.platformUserId = platformUserId
        
        return botConnection
    }

    fun getMemberByPlatformUserId(platformUserId: String, platformType: PlatformType): Member {
        val connection = botConnectionRepository.findByPlatformUserIdAndPlatformTypeAndIsDeletedFalse(platformUserId, platformType)
            ?: throw IllegalArgumentException("연동된 계정을 찾을 수 없습니다. 웹 대시보드에서 발급받은 /start [OTP] 코드를 먼저 전송해 주세요.")
        
        return connection.member
    }
}
