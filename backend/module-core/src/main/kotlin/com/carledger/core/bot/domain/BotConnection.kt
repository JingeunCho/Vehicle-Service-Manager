package com.carledger.core.bot.domain

import com.carledger.core.common.domain.BaseEntity
import com.carledger.core.member.domain.Member
import jakarta.persistence.*

@Entity
@Table(name = "bot_connection")
class BotConnection(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0L,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false)
    val member: Member,

    @Enumerated(EnumType.STRING)
    @Column(name = "platform_type", nullable = false, length = 50)
    var platformType: PlatformType,

    @Column(name = "platform_user_id", length = 100)
    var platformUserId: String? = null,

    @Column(name = "otp_token", nullable = false, unique = true, length = 50)
    var otpToken: String,

    @Column(name = "is_verified", nullable = false)
    var isVerified: Boolean = false

) : BaseEntity()

enum class PlatformType {
    TELEGRAM, DISCORD
}
