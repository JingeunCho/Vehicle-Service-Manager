package com.carledger.web.domain.auth.controller

import com.carledger.web.domain.auth.dto.LoginRequest
import com.carledger.web.domain.auth.dto.SignupRequest
import com.carledger.web.domain.auth.dto.TokenResponse
import com.carledger.web.common.security.JwtTokenProvider
import com.carledger.core.member.service.MemberService
import org.springframework.http.ResponseEntity
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/auth")
class AuthController(
    private val jwtTokenProvider: JwtTokenProvider,
    private val authenticationManagerBuilder: AuthenticationManagerBuilder,
    private val memberService: MemberService,
    private val passwordEncoder: PasswordEncoder
) {

    @GetMapping("/check-email")
    fun checkEmail(@RequestParam email: String): ResponseEntity<Map<String, Boolean>> {
        val isDuplicate = memberService.checkEmailDuplicate(email)
        return ResponseEntity.ok(mapOf("isAvailable" to !isDuplicate))
    }

    @GetMapping("/check-nickname")
    fun checkNickname(@RequestParam nickname: String): ResponseEntity<Map<String, Boolean>> {
        val isDuplicate = memberService.checkNicknameDuplicate(nickname)
        return ResponseEntity.ok(mapOf("isAvailable" to !isDuplicate))
    }

    @PostMapping("/signup")
    fun signup(@RequestBody request: SignupRequest): ResponseEntity<Map<String, String>> {
        val encodedPassword = passwordEncoder.encode(request.password) ?: throw IllegalArgumentException("올바르지 않은 패스워드")
        memberService.signup(
            email = request.email,
            encodedPassword = encodedPassword,
            nickname = request.nickname,
            preferredRegion = request.preferredRegion
        )
        return ResponseEntity.ok(mapOf("message" to "Signup successful"))
    }

    @PostMapping("/login")
    fun login(@RequestBody request: LoginRequest): ResponseEntity<TokenResponse> {
        val authenticationToken = UsernamePasswordAuthenticationToken(request.email, request.password)
        
        val authentication = authenticationManagerBuilder.`object`.authenticate(authenticationToken)
        
        val token = jwtTokenProvider.generateToken(authentication.name)
        
        return ResponseEntity.ok(TokenResponse(token = token, accessToken = token))
    }
    
    @GetMapping("/me")
    fun getCurrentUser(authentication: org.springframework.security.core.Authentication?): ResponseEntity<String> {
        val email = authentication?.name ?: "Anonymous"
        return ResponseEntity.ok("You are authenticated as: \$email")
    }
}
