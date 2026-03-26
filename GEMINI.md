# 🚗 Vehicle-Service-Manager Project Guide

이 가이드는 Gemini CLI가 **Vehicle-Service-Manager** (내부명: `car-ledger`) 프로젝트를 이해하고 최적의 제안을 하기 위한 기술적 지침입니다.

## 🛠 핵심 기술 스택 (Tech Stack)

### Backend (Multi-Module)
- **Framework**: Spring Boot **4.0.4**, Kotlin **2.2.0** (JDK **21**)
- **Data Access**: Spring Data JPA, **QueryDSL 7.1** (Jakarta EE)
- **Database**: MariaDB 11.x, **Liquibase** (Database Migration)
- **Security**: Spring Security, JWT (**jjwt 0.12.5**)
- **Communication**: OpenFeign (External API integration)
- **Build Tool**: Gradle (**Kotlin DSL**)

### Frontend
- **Framework**: **Next.js 16.2.1** (App Router 지향)
- **Styling**: **Tailwind CSS**, Lucide React (Icons)
- **State/Data**: **React-Query (@tanstack/react-query 5.95.2)**, Axios
- **Visualization**: Recharts (Dashboard statistics)

## 🏗 프로젝트 구조 및 모듈 역할

### Backend Submodules
1.  **`module-core`**: 
    - 도메인 엔티티(JPA), Repository, 공통 비즈니스 로직.
    - QueryDSL 설정 및 QClass 생성 담당.
2.  **`module-web`**: 
    - 외부 노출 REST API (Controller, Service, DTO).
    - Spring Security 및 JWT 인증 필터 포함.
    - Liquibase 마이그레이션 스크립트 관리.
3.  **`module-bot`**: 
    - 텔레그램 봇 API 연동 및 메세지 파싱 로직.

### Frontend
- `frontend/src/`: 컴포넌트, 서비스 레이어(API), 훅스(React-Query) 포함.

## 📜 코딩 컨벤션 및 규칙

### General
- 모든 설명과 커밋 메시지는 **한글**을 우선적으로 사용한다.
- **Sequential Thinking**을 사용하여 복잡한 로직을 단계별로 분석하고 해결한다.

### Backend (Kotlin/Spring)
- **DDD (Domain-Driven Design)** 아키텍처를 지향한다.
- **시간 데이터 표준화**: 모든 엔티티 및 DTO의 시간 필드는 ISO-8601 표준을 따르는 **`Instant`** 타입을 사용한다.
- **QueryDSL 사용**:
    - `io.github.openfeign.querydsl` 라이브러리를 사용하며, QClass 생성을 위해 `./gradlew :module-core:compileKotlin`을 수행한다.
    - 목록 조회 시 `Pageable`을 이용한 페이징과 QueryDSL 전용 `OrderSpecifier`를 통한 동적 정렬을 구현한다.
- DB 변경 사항은 반드시 Liquibase 스크립트를 통해 관리한다.

### Frontend (Next.js)
- API 호출은 Axios 인터셉터를 통한 전역 관리를 지향한다.
- 데이터 페칭은 React-Query를 사용하여 캐싱 및 상태 관리를 최적화한다.

## 🚀 주요 명령어 (Commands)

### Backend (Root Directory)
- **빌드**: `./gradlew clean build`
- **웹 서버 실행**: `./gradlew :module-web:bootRun`
- **봇 서버 실행**: `./gradlew :module-bot:bootRun`
- **QueryDSL QClass 생성**: `./gradlew :module-core:compileKotlin`

### Frontend (frontend/ Directory)
- **개발 서버 실행**: `npm run dev`
- **프로덕션 빌드**: `npm run build`

---
*💡 이 파일은 프로젝트의 기술적 진화에 따라 수시로 업데이트됩니다.*
