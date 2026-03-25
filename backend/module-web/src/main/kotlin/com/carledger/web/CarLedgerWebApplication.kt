package com.carledger.web

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.persistence.autoconfigure.EntityScan
import org.springframework.boot.runApplication
import org.springframework.context.annotation.ComponentScan
import org.springframework.data.jpa.repository.config.EnableJpaRepositories

@SpringBootApplication
@ComponentScan(basePackages = ["com.carledger.core", "com.carledger.web"])
@EntityScan(basePackages = ["com.carledger.core"])
@EnableJpaRepositories(basePackages = ["com.carledger.core"])
class CarLedgerWebApplication

fun main(args: Array<String>) {
    runApplication<CarLedgerWebApplication>(*args)
}
