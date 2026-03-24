package com.carledger.core.vehicle.repository

import com.carledger.core.vehicle.domain.Vehicle
import org.springframework.data.jpa.repository.JpaRepository

interface VehicleRepository : JpaRepository<Vehicle, Long> {
    fun findAllByMemberIdAndIsDeletedFalse(memberId: Long): List<Vehicle>
}
