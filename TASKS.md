# 🚗 Car Ledger Project Tasks & Milestone

현재 프로젝트의 개발 진척도를 파악하기 위한 관리 문서입니다. 
다른 PC에서 작업하실 때 이 문서를 기준으로 진행 상황을 완벽하게 동기화할 수 있습니다.

## 🟢 완료된 마일스톤 (Completed)

- [x] **Phase 0: Project Scaffolding** (Gradle 멀티 모듈 및 Next.js 초기 셋업)
- [x] **Phase 1: Database & Core Entities** (JPA Entity 및 QueryDSL 셋업)
- [x] **Phase 2: Bot & Business Logic** (정규식 기반 텔레그램 메세지 파서)
- [x] **Phase 3: Frontend Dashboard** (Recharts 기반 통계 레이아웃)
- [x] **Phase 4~7: Spring Boot & Security Configuration** (JWT 필터 인증, 비즈니스 로직 작성)
- [x] **Phase 8~11: REST APIs (Domain-Driven)** (Auth, Vehicle, Ledger CRUD API 작성)
- [x] **Phase 12: Telegram Bot Integration** (OTP 발급 및 계정 바인딩 `/start`)
- [x] **Phase 13: Frontend API Integration Config** (Axios, React-Query 초기 세팅)
- [x] **Phase 14: Frontend Auth UI** (회원가입, 로그인 페이지 및 Redirection 처리)
- [x] **Phase 15: Frontend Vehicle Inventory UI** (차량 추가 모달, 디자인 스위칭 UX, 튜닝 내역 모달)
- [x] **Phase 16: Backend Vehicle Expansion API** (대표 차량 지정 Transaction, 추가 필드 확장)
- [x] **Phase 17: Frontend Ledgers Table UI** (차계부 상세 리스트, 모달 기반 요약 뷰 및 수정/등록 폼)

## 🚀 앞으로 진행할 핵심 마일스톤 (To-Do)

- [x] **Phase 18: Full-Stack Integration Testing** (JWT 인증 연동, 대시보드 통계 실데이터 연결, 차량 스위칭 검증)

## 🚀 앞으로 진행할 핵심 마일스톤 (To-Do)

### Phase 19: Advanced Backend & Bot Features (현재 진행 중)
- [x] **지출 내역 페이징 고도화**: QueryDSL을 활용한 `Pageable` 조회 및 프론트엔드 무한 스크롤/페이지네이션 UI 추가 (Ellipsis 및 이동 버튼 포함)
- [x] **Dynamic Enum 메타데이터 API**: 백엔드 Enum에 `categoryName` 필드를 추가하고 프론트엔드에서 필터 목록을 동적으로 받아오도록 리팩토링 (유지보수성 향상)
- [x] **시스템 날짜 형식 Instant 전환**: 모든 도메인(Vehicle, Ledger) 및 DTO의 날짜 타입을 `Instant`로 통합하여 타임존 독립적 구조 확보
- [x] **도메인 구조 통합**: `MaintenanceRecord` 엔터티를 삭제하고 `Ledger` 도메인으로의 데이터 통합 및 코드 리팩토링 완료
- [ ] **유가 연동 알고리즘**: 오피넷(Opinet) 오픈 API 또는 크롤링을 통한 실시간 주유 단가 연동
- [ ] **텔레그램 봇 고도화**: 복수 차량 소유 유저를 위한 Inline Keyboard 응답 로직 및 간편 기록 기능 추가
- [ ] **통계 엔진 강화**: 월간 리포트 생성 및 전월 대비 지출 변화 분석 로직 추가


### Phase 20: DevOps & Deployment
- [ ] Backend (`module-web`, `module-bot`) 및 Frontend Dockerfile 작성
- [ ] `docker-compose.yml` 하나로 DB부터 서버까지 한 번에 구동되도록 인프라 구축
- [ ] GitHub Actions를 이용한 CI/CD 배포 파이프라인 구성

### Phase 21: Financial Data Integration (Long-term Plan)
- [ ] **카드사/은행 API 연동**: MyData API 또는 문자/알림 파싱을 통한 결제 내역 자동 수집
- [ ] **자동차 관련 지출 자동 분류**: 가맹점 정보(주유소, 정비소, 주차장 등) 기반 AI 분류 및 차계부 자동 등록 제안 모듈 구현

---
*💡 이 파일(`TASKS.md`)은 `git commit` 에 포함되어 원격 저장소에 업로드되므로, 집/회사 등 어떤 기기에서든 현재까지의 최신 개발 상태를 쉽게 확인할 수 있습니다.*
