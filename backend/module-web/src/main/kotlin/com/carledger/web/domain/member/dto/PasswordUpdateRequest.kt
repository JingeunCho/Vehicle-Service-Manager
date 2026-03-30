package com.carledger.web.domain.member.dto

import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.Size

data class PasswordUpdateRequest(
    @field:NotBlank
    val currentPassword: String,

    @field:NotBlank
    @field:Size(min = 8, max = 50)
    val newPassword: String,

    @field:NotBlank
    val confirmPassword: String
)
