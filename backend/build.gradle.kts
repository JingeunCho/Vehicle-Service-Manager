plugins {
    id("org.springframework.boot") version "4.0.4" apply false
    id("io.spring.dependency-management") version "1.1.4" apply false
    kotlin("jvm") version "2.2.0"
    kotlin("plugin.spring") version "2.2.0" apply false
    kotlin("plugin.jpa") version "2.2.0" apply false
    kotlin("kapt") version "2.2.0" apply false
}

allprojects {
    group = "com.carledger"
    version = "1.0-SNAPSHOT"

    repositories {
        mavenCentral()
    }

}



subprojects {
    apply(plugin = "org.jetbrains.kotlin.jvm")
    apply(plugin = "org.jetbrains.kotlin.plugin.spring")
    apply(plugin = "kotlin-kapt")
    apply(plugin = "io.spring.dependency-management")
    apply(plugin = "java-library")

    // module-web & module-bot will apply org.springframework.boot

    dependencies {
        "implementation"("org.jetbrains.kotlin:kotlin-reflect")
        "implementation"("com.fasterxml.jackson.module:jackson-module-kotlin")
        "testImplementation"("org.springframework.boot:spring-boot-starter-test")
        "testImplementation"("org.jetbrains.kotlin:kotlin-test-junit5")
    }

    tasks.withType<org.jetbrains.kotlin.gradle.tasks.KotlinJvmCompile> {
        compilerOptions {
            freeCompilerArgs.add("-Xjsr305=strict")
            jvmTarget.set(org.jetbrains.kotlin.gradle.dsl.JvmTarget.JVM_21)
        }
    }

    tasks.withType<Test> {
        useJUnitPlatform()
    }

    
}
