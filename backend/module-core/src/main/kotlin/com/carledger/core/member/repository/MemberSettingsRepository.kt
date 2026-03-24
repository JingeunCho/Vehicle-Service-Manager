package com.carledger.core.member.repository

import com.carledger.core.member.domain.MemberSettings
import org.springframework.data.jpa.repository.JpaRepository

interface MemberSettingsRepository : JpaRepository<MemberSettings, Long> {
    fun findByMemberId(memberId: Long): MemberSettings?
}
