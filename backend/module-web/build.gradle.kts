plugins {
    id("org.springframework.boot")
}

dependencies {
    implementation(project(":module-core"))

    // Spring Boot Web & Validation
    api("org.springframework.boot:spring-boot-starter-web")
    implementation("org.springframework.boot:spring-boot-starter-validation")

    // Spring Security
    api("org.springframework.boot:spring-boot-starter-security")

    // JWT (JSON Web Token) - jjwt 라이브러리
    implementation("io.jsonwebtoken:jjwt-api:0.12.5")
    runtimeOnly("io.jsonwebtoken:jjwt-impl:0.12.5")
    runtimeOnly("io.jsonwebtoken:jjwt-jackson:0.12.5")
}
