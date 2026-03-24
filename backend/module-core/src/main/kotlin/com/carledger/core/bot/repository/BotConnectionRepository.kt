package com.carledger.core.bot.repository

import com.carledger.core.bot.domain.BotConnection
import com.carledger.core.bot.domain.PlatformType
import org.springframework.data.jpa.repository.JpaRepository

interface BotConnectionRepository : JpaRepository<BotConnection, Long> {
    fun findByOtpTokenAndIsDeletedFalse(otpToken: String): BotConnection?
    fun findByMemberIdAndPlatformTypeAndIsDeletedFalse(memberId: Long, platformType: PlatformType): BotConnection?
    fun findByPlatformUserIdAndPlatformTypeAndIsDeletedFalse(platformUserId: String, platformType: PlatformType): BotConnection?
}
