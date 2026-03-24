package com.carledger.core.category.repository

import com.carledger.core.category.domain.Category
import org.springframework.data.jpa.repository.JpaRepository

interface CategoryRepository : JpaRepository<Category, Long> {
    fun findByNameAndIsDeletedFalse(name: String): Category?
}
