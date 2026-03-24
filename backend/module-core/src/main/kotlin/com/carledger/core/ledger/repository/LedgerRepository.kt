package com.carledger.core.ledger.repository

import com.carledger.core.ledger.domain.Ledger
import org.springframework.data.jpa.repository.JpaRepository

interface LedgerRepository : JpaRepository<Ledger, Long>, LedgerRepositoryCustom
