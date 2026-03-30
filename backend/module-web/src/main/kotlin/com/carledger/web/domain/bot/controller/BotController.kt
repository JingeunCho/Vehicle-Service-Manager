package com.carledger.web.domain.bot.controller

import com.carledger.core.bot.domain.PlatformType
import com.carledger.core.bot.service.BotConnectionService
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/bot")
class BotController(
    private val botConnectionService: BotConnectionService
) {

    @PostMapping("/telegram/otp")
    fun generateTelegramOtp(@AuthenticationPrincipal userDetails: UserDetails): Map<String, String> {
        val otp = botConnectionService.generateOtpToken(userDetails.username, PlatformType.TELEGRAM)
        return mapOf("otp" to otp)
    }

    @GetMapping("/telegram/status")
    fun getTelegramStatus(@AuthenticationPrincipal userDetails: UserDetails): Map<String, Any> {
        val email = userDetails.username
        val isLinked = botConnectionService.isLinkedByEmail(email, PlatformType.TELEGRAM)
        val latestOtp = if (!isLinked) botConnectionService.findLatestOtp(email, PlatformType.TELEGRAM) else null
        
        return mapOf(
            "isLinked" to isLinked,
            "otp" to (latestOtp ?: "")
        )
    }
}
