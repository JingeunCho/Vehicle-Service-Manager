plugins {
    id("org.springframework.boot")
}

dependencies {
    implementation(project(":module-core"))

    // Bot 모듈에서도 Webhook, 비동기 통신 등 WebClient/RestClient 활용을 고려
    api("org.springframework.boot:spring-boot-starter-web")
    
    // 텔레그램 공식 봇 라이브러리 예시 (Webhook or Long Polling)
    implementation("org.telegram:telegrambots-spring-boot-starter:6.9.7")
}
