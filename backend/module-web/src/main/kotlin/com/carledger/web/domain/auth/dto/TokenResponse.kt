package com.carledger.web.domain.auth.dto

data class TokenResponse(
    val accessToken: String,
    val tokenType: String = "Bearer"
)
