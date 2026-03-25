plugins{
    id("org.springframework.boot")
    kotlin("plugin.jpa")
}

dependencies {
    implementation(project(":module-core"))

    // Spring Boot Web & Validation
    api("org.springframework.boot:spring-boot-starter-web")
    implementation("org.springframework.boot:spring-boot-starter-validation")
    implementation("org.springframework.boot:spring-boot-starter-data-jpa")
    runtimeOnly("org.mariadb.jdbc:mariadb-java-client")

    // Spring Security
    api("org.springframework.boot:spring-boot-starter-security")

    // JWT (JSON Web Token) - jjwt 라이브러리
    implementation("io.jsonwebtoken:jjwt-api:0.12.5")
    runtimeOnly("io.jsonwebtoken:jjwt-impl:0.12.5")
    runtimeOnly("io.jsonwebtoken:jjwt-jackson:0.12.5")
    //liquibase 추가
    implementation("org.springframework.boot:spring-boot-starter-liquibase")
}
