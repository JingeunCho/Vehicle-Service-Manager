# 🚗 Vehicle Service Manager (Car Ledger)

차량 관리 및 차계부(지출 내역) 통합 관리 시스템. 텔레그램 봇 연동, 소모품 이력 자동 추적, 차량 제원 관리 기능을 제공합니다.

---

## 🏗️ 기술 스택

| 항목 | 기술 |
|------|------|
| 백엔드 | Spring Boot 3.5.x + JDK 21 + Kotlin |
| DB | MariaDB + Liquibase (마이그레이션 관리) |
| ORM | Spring Data JPA + QueryDSL 7.1 |
| 인증 | Spring Security + JWT |
| 프론트엔드 | Next.js (App Router) + TypeScript + TailwindCSS |
| 상태관리 | TanStack Query (React Query) |
| 빌드 | Gradle 멀티모듈 |
| 봇 | Telegram Bot API (module-bot) |

---

## 📁 프로젝트 구조

```
Vehicle-Service-Manager/
├── backend/
│   ├── module-core/          # 도메인 엔터티, 리포지토리, 서비스
│   │   └── src/main/kotlin/com/carledger/core/
│   │       ├── vehicle/domain/   # Vehicle, VehicleSpec, WheelSpec, TireSpec, MaintenanceType
│   │       ├── ledger/domain/    # Ledger (maintenanceType 필드 포함)
│   │       ├── member/domain/    # Member
│   │       ├── category/domain/  # Category
│   │       └── common/domain/    # BaseEntity
│   ├── module-web/           # REST API, Spring Security, DTO
│   │   └── src/main/
│   │       ├── kotlin/.../vehicle/   # VehicleController, VehicleRequest, VehicleResponse
│   │       ├── kotlin/.../ledger/    # LedgerController, LedgerRequest, LedgerResponse
│   │       └── resources/db/
│   │           ├── changelog-1.0.0.xml  # 초기 스키마
│   │           └── changelog-1.0.1.xml  # 정규화 마이그레이션
│   └── module-bot/           # 텔레그램 봇 리스너 & 파서
├── frontend/
│   └── src/
│       ├── app/(dashboard)/
│       │   ├── vehicles/page.tsx   # 차량 관리 UI
│       │   └── ledgers/page.tsx    # 차계부 등록/조회 UI
│       └── hooks/
│           ├── useVehicles.ts      # 차량 API 훅 + 타입 정의
│           └── useLedgers.ts       # 차계부 API 훅 + MaintenanceType 타입
└── README.md
```

---

## 🗄️ 데이터베이스 스키마 (핵심 테이블)

### 정규화 구조 (`changelog-1.0.1.xml` 적용 후)

```
vehicle
  ├── vehicle_spec (1:1) ─→ front_wheel_id → wheel_spec
  │                      ─→ rear_wheel_id  → wheel_spec
  │                      ─→ front_tire_id  → tire_spec
  │                      └─ rear_tire_id   → tire_spec
  └── ledger (1:N)
        └─ maintenance_type VARCHAR(50) NULL
           (ENGINE_OIL | TRANSMISSION_OIL | DIFFERENTIAL_OIL |
            FRONT_BRAKE_PAD | REAR_BRAKE_PAD |
            FRONT_BRAKE_ROTOR | REAR_BRAKE_ROTOR | COOLANT | OTHER)
```

> ⚠️ **주의**: `wheel_spec.offset` 컬럼명은 MariaDB 예약어 충돌로 `wheel_offset`으로 변경됨

---

## 🔑 핵심 설계 결정

### 1. 소모품 이력 ← Ledger 통합
`MaintenanceRecord` 별도 테이블 없이 `Ledger.maintenanceType` nullable 컬럼으로 통합.
차계부 1회 등록으로 소모품 교환 이력이 자동 추적됩니다.

```
차계부 등록 시: category=정비, amount=70000, maintenanceType=ENGINE_OIL
→ 차량 조회 API: lastMaintenance.ENGINE_OIL.date 자동 계산
```

### 2. 휠/타이어 교체 이력 보존
교체 시 기존 row를 삭제하지 않고 새 `WheelSpec`/`TireSpec` row를 생성.
`VehicleSpec`은 항상 최신 ID만 참조 → 이력 자동 보존.

### 3. 주행거리 단방향 증가 원칙
백엔드(`LedgerService`)와 프론트엔드 모두에서 현재 차량 주행거리보다 작은 값 입력 불가.

---

## 🚀 실행 방법

### 백엔드
```bash
cd backend
./gradlew :module-web:bootRun
```

### 프론트엔드
```bash
cd frontend
npm install
npm run dev
```

### DB 마이그레이션
서버 시작 시 Liquibase가 자동으로 `changelog-master.xml` → `1.0.0` → `1.0.1` 순서로 적용.

---

## 📡 주요 API

| Method | URL | 설명 |
|--------|-----|------|
| POST | `/api/auth/login` | 로그인 (JWT 반환) |
| POST | `/api/auth/signup` | 회원가입 |
| GET | `/api/vehicles` | 내 차량 목록 (lastMaintenance 포함) |
| POST | `/api/vehicles` | 차량 등록 |
| PUT | `/api/vehicles/{id}` | 차량 수정 |
| GET | `/api/ledgers/vehicles/{vehicleId}` | 차계부 목록 |
| POST | `/api/ledgers` | 차계부 등록 (maintenanceType 선택) |
| PUT | `/api/ledgers/{id}` | 차계부 수정 |
| DELETE | `/api/ledgers/{id}` | 차계부 삭제 |

---

## 📌 현재 개발 현황 (2026-03-25 기준)

### ✅ 완료
- 차량 기본 CRUD
- 차량 제원 정규화 (VehicleSpec, WheelSpec, TireSpec)
- 차계부 CRUD API 연동 (프론트엔드 등록 폼 완성)
- 소모품 교환 기록 기능 (카테고리 "정비" → 소모품 종류 선택)
- 주행거리 하한 방어 코드 (프론트 + 백엔드)
- 텔레그램 봇 계정 연동 및 차계부 파싱

### 🚧 미완료 (다음 구현 필요)
1. **차계부 수정(EDIT) API 연동** — `useUpdateLedger` 호출 미구현
2. **차계부 삭제 API 연동** — 삭제 버튼 UI는 있으나 `useDeleteLedger` 호출 미구현
3. **차량 제원 수정 UI** — VehicleSpec, WheelSpec, TireSpec 수정 폼
4. **Opinet 연료 가격 연동** — 주유 시 자동 단가 계산
5. **월별/연비 트렌드 실데이터 연동** — 현재 mock 데이터

### ⚠️ 알려진 이슈
- IDE CSS lint 경고(`Unknown at rule @tailwind`)는 IDE 설정 문제, 빌드에는 영향 없음
- 프론트엔드 차계부 수정 모달(EDIT)은 UI만 있고 API 저장 미연동

---

## 🤝 기여 / 인수인계 참고

자세한 작업 이력 및 TODO는 `task.md` 참조 (`.gemini/antigravity/brain/...`).
