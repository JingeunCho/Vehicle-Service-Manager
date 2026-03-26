# 🚗 Car Ledger Project Tasks & Milestone

가계부 가계부 주행기록 차량 제원 및 정비 관리를 위한 서비스 개발 로직 및 일정 관리 문서입니다.
차량 정비 및 지출 내역을 PC와 모바일(텔레그램 봇)을 통해 쉽게 기록하고 관리하는 것을 목표로 합니다.

## ✅ 프로젝트 개발 완료 단계 (Completed)

- [x] **Phase 0: Project Scaffolding** (Gradle 멀티모듈 및 Next.js 초기 설정)
- [x] **Phase 1: Database & Core Entities** (JPA Entity 및 QueryDSL 설정)
- [x] **Phase 2: Bot & Business Logic** (텔레그램 메시지 파싱 및 비즈니스 로직 기반 마련)
- [x] **Phase 3: Frontend Dashboard** (Recharts 기반 통계 대시보드 UI 구현)
- [x] **Phase 8~11: REST APIs (Domain-Driven)** (Auth, Vehicle, Ledger CRUD API 구현)
- [x] **Phase 12: Telegram Bot Integration** (OTP 인증 및 기초 명령 `/start` 처리)
- [x] **Phase 13: Frontend API Integration Config** (Axios, React-Query 연동 설정)
- [x] **Phase 14: Frontend Auth UI** (로그인/회원가입 및 Redirection 로직)
- [x] **Phase 15: Frontend Vehicle Inventory UI** (차량 리스트, 정보 수정 UX 구현)
- [x] **Phase 16: Backend Vehicle Expansion API** (상세 차량 제원 저장 및 조회 API)
- [x] **Phase 17: Frontend Ledgers Table UI** (가계부 목록 테이블, 상세 조회 및 필터링 기능)
- [x] **Phase 18: Full-Stack Integration Testing** (JWT 인증 기반 엔드투엔드 테스트 완료)

## 🚧 현재 진행 중인 단계 (In Progress)

### Phase 19: Advanced Backend & Bot Features (고급 기능 확장)
- [x] **QueryDSL 페이징 및 정렬 처리**: `Pageable` 및 `OrderSpecifier`를 이용한 유연한 목록 조회 구현
- [x] **Dynamic Enum 조회 API**: 정비 타입(Category) 등 Enum 데이터를 프론트엔드에서 동적으로 활용할 수 있는 API 구현
- [x] **시간 데이터 표준화 (Instant 전환)**: 모든 도메인 및 DTO의 시간 필드를 `Instant` 타입으로 전환하여 Timezone 이슈 해결
- [x] **정비 기록(MaintenanceRecord) 통합 로직**: 가계부 등록 시 정비 내역이 관련 차량 정보에 자동 업데이트되는 로직 구현
- [ ] **유가 정보(Opinet) 연동**: 실시간 유가 API 연동을 통한 최저가 주유소 추천 및 지출 분석
- [ ] **주유 내역 입력 시 단가 수동 입력 기능**: 차계부 주유 내역 등록 시 주유소의 리터당 단가를 사용자가 수동으로 입력하고 관리할 수 있도록 UI/API 고도화
- [ ] **텔레그램 봇 인라인 키보드**: 메시지 내 버튼을 이용한 간편 차계부 등록 UX 개선

### Phase 20: DevOps & Deployment (배포 자동화)
- [ ] Backend (`module-web`, `module-bot`) 및 Frontend Dockerfile 작성
- [ ] `docker-compose.yml` 고도화 (DB 초기화 스크립트 및 Nginx 환경 설정 최적화)
- [ ] CI/CD 파이프라인 구축 (GitHub Actions를 이용한 자동 빌드 및 배포)

## 📌 향후 계획 (Long-term Plan)

- [ ] **금융 데이터 연동 (MyData)**: 카드사 지출 내역 API 연동을 통한 차계부 자동 입력
- [ ] **AI 기반 정비 예측**: 주행 거리 및 정비 이력 데이터를 기반으로 한 소모품 교체 주기 AI 예측 모델 도입

---
*본 문서는 개발 진행 상황에 따라 수시로 업데이트됩니다.*
