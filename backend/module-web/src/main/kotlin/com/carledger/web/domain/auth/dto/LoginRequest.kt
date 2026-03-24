package com.carledger.web.domain.auth.dto

data class LoginRequest(
    val email: String,
    val password: String
)
