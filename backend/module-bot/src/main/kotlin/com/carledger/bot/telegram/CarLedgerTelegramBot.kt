package com.carledger.bot.telegram

import com.carledger.bot.service.BotMessageProcessor
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Component
import org.telegram.telegrambots.bots.TelegramLongPollingBot
import org.telegram.telegrambots.meta.api.methods.send.SendMessage
import org.telegram.telegrambots.meta.api.objects.Update

@Component
class CarLedgerTelegramBot(
    @Value("\${telegram.bot.token}") private val botToken: String,
    @Value("\${telegram.bot.username}") private val botUsername: String,
    private val botMessageProcessor: BotMessageProcessor
) : TelegramLongPollingBot(botToken) {

    override fun getBotUsername(): String = botUsername

    override fun onUpdateReceived(update: Update) {
        if (update.hasMessage() && update.message.hasText()) {
            val chatId = update.message.chatId.toString()
            val text = update.message.text

            // 로직 분리로 인해 Webhook으로 전환하더라도 Controller에서 botMessageProcessor만 호출하면 작동 동일
            val responseText = botMessageProcessor.processMessage(chatId, text)
            
            val message = SendMessage()
            message.chatId = chatId
            message.text = responseText

            execute(message)
        }
    }
}
