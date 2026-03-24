package com.carledger.core.member.repository

import com.carledger.core.member.domain.Member
import org.springframework.data.jpa.repository.JpaRepository

interface MemberRepository : JpaRepository<Member, Long> {
    fun findByEmailAndIsDeletedFalse(email: String): Member?
    fun existsByEmailAndIsDeletedFalse(email: String): Boolean
    fun existsByNicknameAndIsDeletedFalse(nickname: String): Boolean
}
