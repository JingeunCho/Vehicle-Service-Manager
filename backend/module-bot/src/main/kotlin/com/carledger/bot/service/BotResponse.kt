package com.carledger.bot.service

data class BotResponse(
    val text: String,
    val buttons: List<BotButton>? = null
)

data class BotButton(
    val text: String,
    val callbackData: String
)
