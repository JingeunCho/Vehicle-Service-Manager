package com.carledger.core.member.domain

import com.carledger.core.common.domain.BaseEntity
import jakarta.persistence.*

@Entity
@Table(name = "member_settings", catalog = "vms")
class MemberSettings(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0L,

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false, unique = true)
    val member: Member,

    @Column(name = "is_dark_mode", nullable = false)
    var isDarkMode: Boolean = false,

    @Column(name = "telegram_bot_token")
    var telegramBotToken: String? = null // Encrypted AES-256 string

) : BaseEntity()
