plugins {
    kotlin("plugin.jpa")
    kotlin("kapt")
}

dependencies {
    api("org.springframework.boot:spring-boot-starter-data-jpa")
    
    // MariaDB
    runtimeOnly("org.mariadb.jdbc:mariadb-java-client")

    // OpenFeign QueryDSL Fork (7.1) for Jakarta EE
    api("io.github.openfeign.querydsl:querydsl-jpa:7.1.0:jakarta")
    kapt("io.github.openfeign.querydsl:querydsl-apt:7.1.0:jakarta")
    kapt("jakarta.persistence:jakarta.persistence-api")
    kapt("jakarta.annotation:jakarta.annotation-api")
}

val generated = file("build/generated/source/kapt/main")

tasks.withType<org.jetbrains.kotlin.gradle.tasks.KotlinCompile> {
    kotlinOptions {
        jvmTarget = "21"
    }
}
