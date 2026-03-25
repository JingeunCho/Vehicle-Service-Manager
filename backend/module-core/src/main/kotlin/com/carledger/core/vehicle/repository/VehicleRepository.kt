package com.carledger.core.vehicle.repository

import com.carledger.core.vehicle.domain.Vehicle
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Modifying
import org.springframework.data.jpa.repository.Query

interface VehicleRepository : JpaRepository<Vehicle, Long> {
    fun findAllByMemberIdAndIsDeletedFalse(memberId: Long): List<Vehicle>
    fun existsByMemberIdAndIsDeletedFalse(memberId: Long): Boolean

    @Modifying(clearAutomatically = true)
    @Query("UPDATE Vehicle v SET v.isPrimary = false WHERE v.member.id = :memberId")
    fun updateAllIsPrimaryFalse(memberId: Long)
}
