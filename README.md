# 🚗 차계부 및 다중 차량 관리 시스템 (Car Ledger System)

> 언제 어디서든 스마트하게 내 차의 지출과 연비를 관리하세요. 
> 메신저(텔레그램) 봇을 통한 1초 기록부터, 웹 대시보드를 통한 심층 분석까지 제공하는 **SaaS형 다중 차량 관리 플랫폼**입니다.

## 📌 주요 특징 (Key Features)

* **🤖 텔레그램 봇 자동 기록 (Bot Integration)**
  * 복잡한 앱 실행 없이 메신저에서 한 줄만 입력하면 지출이 자동 분류 및 저장됩니다.
  * 예: `"주유 고급유 50000원 대성주유소 15000km"` → 정규식 파서가 차계부(Ledger) 항목으로 즉각 매핑하여 저장.
  * **OTP 기반 계정 연동**: 웹에서 발급된`/start {8자리OTP}` 코드로 텔레그램 계정과 웹 계정을 안전하게 결합 (Webhook/LongPolling 지원).
* **💻 직관적인 웹 대시보드 (Smart Dashboard)**
  * **단일 및 다중 차량 통계 완벽 지원**: 내 차의 당월 총 지출, 평균 주유 단가, 연비 트렌드(Line Chart), 카테고리별 지출 비율(Donut Chart)을 한눈에 파악.
  * `Recharts` 라이브러리를 활용해 N대의 차량 데이터를 겹쳐볼 수 있는 가변형(Flat/Map) 차트 렌더링 도입.
* **🔒 강력한 보안 및 인증 (Security)**
  * **Spring Security + JWT (JSON Web Token)** 기반의 안전한 상태 유지 및 API 인가(Authorization).
  * `BCrypt` 암호화를 통한 사용자(Member) 비밀번호 보호.
* **📦 도메인-주도(DDD) 마이크로 아키텍처 (Domain-Driven Structure)**
  * `module-core`, `module-web`, `module-bot` 의 3-Tier 멀티 모듈 아키텍처로 설계되어 추후 트래픽 증가 여부에 따른 개별 스케일링(Scale-Out)이 가능합니다.
  * 명확한 도메인(Member, Vehicle, Ledger, Bot, Category 등) 기반 패키징으로 뛰어난 응집도와 유지보수성 달성.

---

## 🛠 기술 스택 (Tech Stack)

### **Backend**
*   **Language**: Java 21 / Kotlin 2.x
*   **Framework**: Spring Boot 4.0.4, Spring Security
*   **Database & ORM**: MariaDB, Spring Data JPA, QueryDSL 7.x
*   **Bot API**: Telegram LongPolling Bot API (`telegrambots-spring-boot-starter`)
*   **Build Tool**: Gradle (Kotlin DSL, Multi-module)

### **Frontend**
*   **Framework**: Next.js 14.x (App Router), React 18
*   **Styling**: Tailwind CSS
*   **Charts**: Recharts
*   **Language**: TypeScript

---

## 🏗 프로젝트 구조 (Architecture)

본 프로젝트는 의존성 부패를 막고 확장성을 극대화하기 위해 **Gradle Multi-Module**로 구성되어 있습니다.

```text
📦 Vehicle-Service-Manager
 ┣ 📂 backend
 ┃ ┣ 📂 module-core    # 도메인 모델(Entity), Repository, 핵심 비즈니스 로직(Service) 관장
 ┃ ┣ 📂 module-web     # REST API 컨트롤러, DTO, Spring Security, JWT Auth 담당 (프론트 통신)
 ┃ ┗ 📂 module-bot     # 텔레그램 LongPolling/Webhook 서버, 자연어 파서(Message Parser) 담당
 ┃
 ┗ 📂 frontend         # Next.js 14 기반의 대시보드 및 지출 내역 관리 웹 UI
```

---

## 🚀 빠른 시작 (Getting Started)

### 1. Database Setting (MariaDB)
```sql
CREATE DATABASE car_ledger DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
```
* `backend/module-web/src/main/resources/application.yml` 및 `module-bot` 하위의 데이터베이스 접속 비밀번호(root / password 등)를 로컬 환경에 맞게 수정해주세요.

### 2. Backend Server 실행 (REST API & Web)
```bash
cd backend
./gradlew :module-web:bootRun
```
* 서버가 `localhost:8080` 포트로 기동되며 Database Schema가 자동 생성(`ddl-auto: update` 등) 및 검증됩니다.

### 3. Telegram Bot Server 실행
* 텔레그램에서 `@BotFather`를 통해 새로운 봇(Token)을 발급받습니다.
* `module-bot/src/main/resources/application.yml`의 `bot.token`과 `bot.username`을 수정합니다.
```bash
cd backend
./gradlew :module-bot:bootRun
```
* 봇 서버는 충돌을 막기 위해 `localhost:8081` 포트로 띄워지며 웹 모듈과 별개로 작동합니다.

### 4. Frontend Web 실행
```bash
cd frontend
npm install
npm run dev
```
* 브라우저에서 `http://localhost:3000`에 접속하여 화려한 대시보드를 만나보세요!

---

## 💡 개발 진척도 및 향후 목표 (Milestones & Roadmap)

지금까지 기획/개발이 완료된 핵심 기능과 앞으로 고도화할 목표를 통합한 리스트입니다.

### 🎨 1. 프론트엔드 (Next.js 웹 애플리케이션)
**[✅ 완료된 기능]**
- [x] **공통 대시보드 레이아웃 구축**: Sidebar 요소 및 Tailwind CSS 적용
- [x] **대시보드 통계 & 차트 (Recharts) UI 구현**: 반응형 그래프와 데이터 위젯 구축
- [x] **회원가입 및 로그인 페이지 구현**: 커스텀 Hook(`useAuth`)을 활용한 JWT 토큰 로컬 인증 폼 UI 및 리디렉션 파이프라인
- [x] **내 차량 인벤토리 (관리) 화면**: 신규 차량 다중 등록, 대표 차량(Primary) 논리 전환 UI(Glow Effect) 및 튜닝 내역/점검일 통합 관리 화면 구현
- [x] **React Query & Axios 기반 API 통신 연동**: 실시간 백엔드 데이터(다중 차량 호환) 파싱 및 차트 동기화 방지 

**[🚀 진행 예정 핵심 목표]**
- [x] **지출 내역 상세 조회 (Table View)**: 개별 차계부(Ledger) 기록을 테이블 형태로 조회, 검색, 기간별 필터링(Pagination) 기능
- [x] **수동 차계부 내역 추가 UI**: 텔레그램 봇 외에도 웹 화면에서 카테고리를 눌러 바로 지출을 기록할 수 있는 액션 모달 폼

### ⚙️ 2. 백엔드 핵심 기능 (Spring Boot / DB)
**[✅ 완료된 기능]**
- [x] **멀티 모듈 구조 확립**: `module-core`, `module-web`, `module-bot` 간의 의존성 및 Domain-Driven 패키징 리팩토링
- [x] **보안 및 인증 API (`/api/auth`)**: JWT 서명 발급 및 Spring Security 필터 체인(회원가입/로그인) 파이프라인
- [x] **고도화된 차량(Vehicle) 관리 API**: 다중 차량 CRUD는 물론, 튜닝 내역/정비 주기/보험 만기일에 대한 확장 필드 및 **단일 트랜잭션 기반 대표 차량(Primary) 스위칭 API** 구축 완료
- [x] **지출 내역(Ledger) CRUD API**: 차계부 데이터베이스 저장 및 캘린더/통계 조회를 위한 집계(Aggregation) 로직

**[🚀 진행 예정 핵심 목표]**
- [ ] **오피넷(Opinet) 오픈 API 유가 연동**: 주유 금액만 입력해도 해당 일자의 평균 유가를 계산해 주유량(L)을 역산하는 확장 로직
- [ ] **리스트 페이징 및 검색 필터링 최적화**: 지출 내역이 수만 건 쌓일 것을 대비한 QueryDSL 페이징(Pageable) 동적 쿼리 고도화

### 🤖 3. 메신저 연동 자동화 (Telegram Bot)
**[✅ 완료된 기능]**
- [x] **Telegram LongPolling 봇 서버 구축**: 로컬 개발을 위한 텔레그램 소켓 리스너 구현
- [x] **OTP 기반 계정 바인딩 (`/start {OTP}`)**: 텔레그램 오픈 채팅 아이디를 웹(Member) 회원의 ID번호와 영구 결합하는 인증 처리
- [x] **자연어 기반 지출 파서 연동**: 텍스트("주유 고급유 50000원 12000km")를 인지하여 Ledger 서비스로 Insert 시키는 단일 차량 베이스 파이프라인

**[🚀 진행 예정 핵심 목표]**
- [ ] **다중 차량 선택 봇 파싱 처리 로직**: 유저가 2대 이상의 차량을 가졌을 때 "주유 5만원 쏘나타" 와 같이 메시지 안에 차량 모델 키워드를 직접 인식하는 고급 파서(Parser) 고도화
- [ ] **텔레그램 Inline Keyboard (버튼) 응답**: 봇 파싱이 불확실할 때, "어떤 차량에 등록할까요?" 등의 텔레그램 네이티브 대화형 UI 버튼 렌더링

### 🐳 4. 배포 환경 및 인프라 (DevOps)
**[🚀 진행 예정 핵심 목표]**
- [ ] **도커 라이징 (Dockerizing)**: 백엔드 `module-web`, `module-bot` 및 Next.js 프론트엔드를 손쉽게 띄울 수 있도록 Dockerfile 구성
- [ ] **Docker Compose 구성**: 한 번의 명령어로 `MariaDB`, `Server`, `Bot`, `Client`를 통째로 띄울 수 있는 `docker-compose.yml` 작성
- [ ] **CI/CD 파이프라인**: GitHub Actions를 통한 브랜치 병합 시 자동 빌드, 테스트 체크, 클라우드 서버 배포 자동화
- [ ] **텔레그램 Webhook 전환**: 로컬 개발용 LongPolling 방식을 Nginx 등 실서버 HTTPS 프록시로 통하는 Webhook 방식으로 전환
