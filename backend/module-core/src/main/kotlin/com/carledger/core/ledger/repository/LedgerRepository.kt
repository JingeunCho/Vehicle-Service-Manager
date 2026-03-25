package com.carledger.core.ledger.repository

import com.carledger.core.ledger.domain.Ledger
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query

interface LedgerRepository : JpaRepository<Ledger, Long>, LedgerRepositoryCustom {

    /**
     * 차량의 소모품 유형별 가장 최신 Ledger 기록 조회
     * VehicleResponse의 lastMaintenance 계산에 사용
     */
    @Query("""
        SELECT l FROM Ledger l 
        WHERE l.vehicle.id = :vehicleId 
          AND l.maintenanceType IS NOT NULL 
          AND l.isDeleted = false
        ORDER BY l.recordDate DESC
    """)
    fun findMaintenanceRecordsByVehicleId(vehicleId: Long): List<Ledger>
}
