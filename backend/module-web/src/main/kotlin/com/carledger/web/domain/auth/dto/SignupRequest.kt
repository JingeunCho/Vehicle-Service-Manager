package com.carledger.web.domain.auth.dto

data class SignupRequest(
    val email: String,
    val password: String,
    val nickname: String,
    val preferredRegion: String? = null
)
