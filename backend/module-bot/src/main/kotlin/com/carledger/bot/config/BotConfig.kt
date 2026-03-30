package com.carledger.bot.config

import com.carledger.bot.telegram.CarLedgerTelegramBot
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.telegram.telegrambots.meta.TelegramBotsApi
import org.telegram.telegrambots.updatesreceivers.DefaultBotSession

@Configuration
class BotConfig {

    @Bean
    fun telegramBotsApi(carLedgerTelegramBot: CarLedgerTelegramBot): TelegramBotsApi {
        return TelegramBotsApi(DefaultBotSession::class.java).apply {
            registerBot(carLedgerTelegramBot)
        }
    }
}
