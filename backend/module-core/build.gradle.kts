plugins {
    kotlin("plugin.jpa")
}

dependencies {
    api("org.springframework.boot:spring-boot-starter-data-jpa:4.0.4")
    implementation("com.fasterxml.jackson.module:jackson-module-kotlin:2.21.2")
    implementation("org.springframework.boot:spring-boot-starter-test:4.0.4")
    // MariaDB
    runtimeOnly("org.mariadb.jdbc:mariadb-java-client:3.5.7")

    // OpenFeign QueryDSL Fork (7.1) for Jakarta EE
    api("io.github.openfeign.querydsl:querydsl-jpa:7.1")
    "kapt"("io.github.openfeign.querydsl:querydsl-apt:7.1:jakarta")
    "kapt"("jakarta.persistence:jakarta.persistence-api:3.1.0")
    "kapt"("jakarta.annotation:jakarta.annotation-api:2.1.1")

    implementation("org.liquibase:liquibase-core:4.25.1")
}


tasks.withType<org.jetbrains.kotlin.gradle.tasks.KotlinJvmCompile> {
    compilerOptions {
        jvmTarget.set(org.jetbrains.kotlin.gradle.dsl.JvmTarget.JVM_21)
    }
}
