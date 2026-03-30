package com.carledger.web.domain.auth.dto

import com.fasterxml.jackson.annotation.JsonProperty

data class TokenResponse(
    @JsonProperty("token")
    val token: String,
    @JsonProperty("email")
    val email: String,
    @JsonProperty("nickname")
    val nickname: String,
    @JsonProperty("accessToken")
    val accessToken: String = "" // 하위 호환성 위해 유지
)
