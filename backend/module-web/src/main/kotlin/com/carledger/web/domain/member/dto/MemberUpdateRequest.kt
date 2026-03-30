package com.carledger.web.domain.member.dto

import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.Size

data class MemberUpdateRequest(
    @field:NotBlank
    @field:Size(min = 2, max = 50)
    val nickname: String,

    @field:Size(max = 20)
    val phoneNumber: String? = null,

    @field:Size(max = 100)
    val preferredRegion: String? = null
)
