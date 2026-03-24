package com.carledger.core.ledger.domain

import jakarta.persistence.*
import java.math.BigDecimal
import java.time.LocalDate

@Entity
@Table(name = "ledger")
class Ledger(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0L,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vehicle_id", nullable = false)
    val vehicle: Vehicle,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    val category: Category,

    @Column(name = "record_date", nullable = false)
    var recordDate: LocalDate,

    @Column(nullable = false, precision = 15, scale = 2)
    var amount: BigDecimal,

    @Column(name = "mileage_at_record", nullable = false)
    var mileageAtRecord: Int,

    @Column(length = 500)
    var memo: String? = null,

    // 주유 전용 컬럼 (Nullable)
    @Column(name = "unit_price", precision = 10, scale = 2)
    var unitPrice: BigDecimal? = null,

    @Column(precision = 10, scale = 2)
    var volume: BigDecimal? = null,

    @Column(name = "gas_station_name", length = 100)
    var gasStationName: String? = null,

    @Column(name = "is_opinet_auto")
    var isOpinetAuto: Boolean = false

) : BaseEntity()
