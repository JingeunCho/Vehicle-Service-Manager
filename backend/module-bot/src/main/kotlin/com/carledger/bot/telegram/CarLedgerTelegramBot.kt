package com.carledger.bot.telegram

import com.carledger.bot.service.BotMessageProcessor
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Component
import org.telegram.telegrambots.bots.TelegramLongPollingBot
import org.telegram.telegrambots.meta.api.methods.send.SendMessage
import org.telegram.telegrambots.meta.api.objects.Update
import org.telegram.telegrambots.meta.api.objects.replykeyboard.InlineKeyboardMarkup
import org.telegram.telegrambots.meta.api.objects.replykeyboard.buttons.InlineKeyboardButton
import com.carledger.bot.service.BotResponse
import org.slf4j.LoggerFactory
import jakarta.annotation.PostConstruct

@Component
class CarLedgerTelegramBot(
    @param:Value("\${telegram.bot.token}") private val botToken: String,
    @param:Value("\${telegram.bot.username}") private val botUsername: String,
    private val botMessageProcessor: BotMessageProcessor
) : TelegramLongPollingBot(botToken) {

    private val logger = LoggerFactory.getLogger(CarLedgerTelegramBot::class.java)

    override fun getBotUsername(): String = botUsername

    @PostConstruct
    fun init() {
        logger.info("Initializing Telegram Bot: {} with token: {}...", botUsername, botToken.substring(0, 10) + "...")
    }

    override fun onUpdateReceived(update: Update) {
        if (update.hasMessage() && update.message.hasText()) {
            val chatId = update.message.chatId.toString()
            val text = update.message.text

            val botResponse = botMessageProcessor.processMessage(chatId, text)
            sendBotResponse(chatId, botResponse)
        } else if (update.hasCallbackQuery()) {
            val chatId = update.callbackQuery.message.chatId.toString()
            val data = update.callbackQuery.data

            val botResponse = botMessageProcessor.processCallback(chatId, data)
            sendBotResponse(chatId, botResponse)
        }
    }

    private fun sendBotResponse(chatId: String, botResponse: BotResponse) {
        val message = SendMessage()
        message.chatId = chatId
        message.text = botResponse.text

        botResponse.buttons?.let { buttons ->
            val inlineKeyboardMarkup = InlineKeyboardMarkup()
            val rows = buttons.map { button ->
                val inlineKeyboardButton = InlineKeyboardButton()
                inlineKeyboardButton.text = button.text
                inlineKeyboardButton.callbackData = button.callbackData
                listOf(inlineKeyboardButton)
            }
            inlineKeyboardMarkup.keyboard = rows
            message.replyMarkup = inlineKeyboardMarkup
        }

        execute(message)
    }
}
