package com.carledger.core.member.domain

import com.carledger.core.common.domain.BaseEntity
import jakarta.persistence.*

@Entity
@Table(name = "member", catalog = "vms")
class Member(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0L,

    @Column(nullable = false, unique = true)
    var email: String,

    @Column(nullable = false)
    var password: String, // will store encoded password

    @Column(nullable = false, length = 50)
    var nickname: String,

    @Column(name = "preferred_region", length = 100)
    var preferredRegion: String? = null

) : BaseEntity()
