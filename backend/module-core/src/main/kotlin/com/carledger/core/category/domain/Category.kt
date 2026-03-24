package com.carledger.core.category.domain

import com.carledger.core.common.domain.BaseEntity
import jakarta.persistence.*

@Entity
@Table(name = "category")
class Category(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0L,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_id")
    var parent: Category? = null,

    @OneToMany(mappedBy = "parent", cascade = [CascadeType.ALL])
    var children: MutableList<Category> = mutableListOf(),

    @Column(nullable = false, length = 100)
    var name: String,

    @Enumerated(EnumType.STRING)
    @Column(name = "category_type", nullable = false, length = 50)
    var categoryType: CategoryType

) : BaseEntity() {
    fun addChild(child: Category) {
        children.add(child)
        child.parent = this
    }
}

enum class CategoryType {
    FUEL, MAINTENANCE, REPAIR, TUNING, CAR_CARE, FIXED_COST
}
