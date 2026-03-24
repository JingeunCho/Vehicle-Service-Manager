package com.carledger.web.domain.member.controller

import com.carledger.core.member.service.MemberService
import com.carledger.web.domain.member.dto.MemberResponse
import org.springframework.http.ResponseEntity
import org.springframework.security.core.Authentication
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/members")
class MemberController(
    private val memberService: MemberService
) {
    @GetMapping("/me")
    fun getMyProfile(authentication: Authentication?): ResponseEntity<MemberResponse> {
        val email = authentication?.name ?: throw IllegalArgumentException("Not authenticated")
        val member = memberService.getMemberByEmail(email)
        val settings = memberService.getMemberSettings(member.id)
        
        return ResponseEntity.ok(MemberResponse.of(member, settings))
    }
}
