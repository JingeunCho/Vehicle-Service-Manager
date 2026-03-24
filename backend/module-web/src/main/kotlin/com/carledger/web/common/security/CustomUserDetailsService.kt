package com.carledger.web.common.security

import com.carledger.core.member.repository.MemberRepository
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.security.core.userdetails.UsernameNotFoundException
import org.springframework.stereotype.Service

@Service
class CustomUserDetailsService(
    private val memberRepository: MemberRepository
) : UserDetailsService {
    
    override fun loadUserByUsername(username: String): UserDetails {
        val member = memberRepository.findByEmailAndIsDeletedFalse(username)
            ?: throw UsernameNotFoundException("User not found with email: $username")
            
        return CustomUserDetails(member)
    }
}
