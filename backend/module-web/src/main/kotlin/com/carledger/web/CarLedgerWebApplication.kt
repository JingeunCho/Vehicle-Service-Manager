package com.carledger.web

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.autoconfigure.domain.EntityScan
import org.springframework.boot.runApplication
import org.springframework.context.annotation.ComponentScan
import org.springframework.data.jpa.repository.config.EnableJpaRepositories

@SpringBootApplication
@ComponentScan(basePackages = ["com.carledger.core", "com.carledger.web"])
@EntityScan(basePackages = ["com.carledger.core.domain"])
@EnableJpaRepositories(basePackages = ["com.carledger.core.repository"])
class CarLedgerWebApplication

fun main(args: Array<String>) {
    runApplication<CarLedgerWebApplication>(*args)
}
