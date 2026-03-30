package com.carledger.web.domain.member.controller

import com.carledger.core.member.service.MemberService
import com.carledger.web.domain.member.dto.MemberResponse
import com.carledger.web.domain.member.dto.MemberUpdateRequest
import com.carledger.web.domain.member.dto.PasswordUpdateRequest
import org.apache.coyote.BadRequestException
import org.springframework.http.ResponseEntity
import org.springframework.security.core.Authentication
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/members")
class MemberController(
    private val memberService: MemberService,
    private val passwordEncoder: PasswordEncoder
) {
    @GetMapping("/me")
    fun getMyProfile(authentication: Authentication?): ResponseEntity<MemberResponse> {
        val email = authentication?.name ?: throw IllegalArgumentException("인증되지 않은 사용자입니다.")
        val member = memberService.getMemberByEmail(email)
        val settings = memberService.getMemberSettings(member.id)
        
        return ResponseEntity.ok(MemberResponse.of(member, settings))
    }

    @PutMapping("/me")
    fun updateMyProfile(
        authentication: Authentication?,
        @RequestBody request: MemberUpdateRequest
    ): ResponseEntity<MemberResponse> {
        val email = authentication?.name ?: throw IllegalArgumentException("인증되지 않은 사용자입니다.")
        val member = memberService.updateProfile(
            email = email,
            nickname = request.nickname,
            phoneNumber = request.phoneNumber,
            preferredRegion = request.preferredRegion
        )
        val settings = memberService.getMemberSettings(member.id)
        
        return ResponseEntity.ok(MemberResponse.of(member, settings))
    }

    @PutMapping("/me/password")
    fun changePassword(
        authentication: Authentication?,
        @RequestBody request: PasswordUpdateRequest
    ): ResponseEntity<Map<String, String>> {
        val email = authentication?.name ?: throw IllegalArgumentException("인증되지 않은 사용자입니다.")
        
        if (request.newPassword != request.confirmPassword) {
            throw IllegalArgumentException("새 비밀번호와 확인 비밀번호가 일치하지 않습니다.")
        }
        
        memberService.updatePassword(
            email = email,
            validateCurrentPassword = { storedPassword -> passwordEncoder.matches(request.currentPassword, storedPassword) },
            newEncodedPassword = passwordEncoder.encode(request.newPassword)?: throw BadRequestException("비밀번호가 올바르지 않습니다.")
        )
        
        return ResponseEntity.ok(mapOf("message" to "비밀번호가 성공적으로 변경되었습니다."))
    }
}
