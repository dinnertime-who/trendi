# 개발 로드맵 및 일정

**총 개발 기간**: 14일 (약 2주)
**팀 구성**: 프론트엔드 개발자 1-2명 + 백엔드 개발자 1명

---

## 주간별 마일스톤

### Week 1 (1-7일): 기초 및 인증 시스템

#### Day 1-2: 프로젝트 셋업 및 API 설계 (30,000원)
**목표**: 개발 환경 구성 및 기본 아키텍처 설계

**백엔드 작업:**
- [ ] NestJS 모듈 구조 설정 (Auth, User, Service, Order, Review, Admin)
- [ ] Drizzle ORM 스키마 정의 (모든 테이블)
- [ ] 데이터베이스 마이그레이션 실행
- [ ] 인증 미들웨어 및 가드 설정
- [ ] CORS 및 환경 변수 설정
- [ ] API 기본 응답 형식 정의

**프론트엔드 작업:**
- [ ] 프로젝트 구조 확인 (이미 Setup 됨)
- [ ] 인증 관련 Zustand 스토어 생성
- [ ] API 클라이언트 설정 (axios/fetch 인스턴스)
- [ ] TanStack Query 설정
- [ ] 기본 레이아웃 컴포넌트 (Header, Sidebar 등)

**산출물:**
- API 명세서 (OpenAPI/Swagger)
- 데이터베이스 스키마 다이어그램
- 프로젝트 구조 문서

---

#### Day 3-4: 인증 시스템 (350,000원)
**목표**: 로그인, 회원가입, 인증 미들웨어 완성

**백엔드 작업:**
- [ ] JWT 토큰 생성/검증 로직
- [ ] 비밀번호 암호화 (bcrypt)
- [ ] 로그인 API (`POST /auth/login`)
- [ ] 회원가입 API (`POST /auth/register`)
- [ ] 이메일 중복 확인 API (`POST /auth/check-email`)
- [ ] 토큰 갱신 API (`POST /auth/refresh-token`)
- [ ] 비밀번호 재설정 API (`POST /auth/reset-password`, `/auth/send-reset-code` 등)
- [ ] 소셜 로그인 준비 (Kakao, Naver, Google)
- [ ] 에러 핸들링 및 검증

**프론트엔드 작업:**
- [ ] 로그인 페이지 UI (`/sign-in`)
- [ ] 회원가입 페이지 UI (`/sign-up`) - Step 폼
- [ ] 계정 찾기 페이지 UI (`/find-account`)
- [ ] 인증 API 호출 훅 (`useLogin`, `useRegister` 등)
- [ ] 인증 상태 관리 (Zustand 스토어)
- [ ] 보호된 라우트 설정
- [ ] 로그인 상태 유지 (쿠키/로컬스토리지)

**테스트:**
- [ ] 로그인 / 회원가입 기본 기능 테스트
- [ ] 에러 케이스 테스트 (중복 이메일, 잘못된 비밀번호 등)

---

#### Day 5-7: 사용자 기본 페이지 (325,000원)
**목표**: 마이페이지 및 기본 사용자 기능

**백엔드 작업:**
- [ ] 사용자 프로필 조회 API (`GET /user/profile`)
- [ ] 사용자 프로필 수정 API (`PUT /user/profile`)
- [ ] 환불 계좌 API (`GET /user/account-info`, `PUT /user/account-info`)
- [ ] 주문 목록 API (`GET /user/orders`)
- [ ] 주문 상세 API (`GET /user/orders/:id`)

**프론트엔드 작업:**
- [ ] 마이페이지 메인 (`/mypage`)
- [ ] 마이페이지 레이아웃 (사이드바 네비게이션)
- [ ] 회원 정보 수정 모달
- [ ] 환불 계좌 관리
- [ ] Quick Actions 카드

**테스트:**
- [ ] 프로필 조회 및 수정 테스트
- [ ] 인증 없이 접근 시 리다이렉트 테스트

---

### Week 2 (8-14일): 핵심 기능 및 관리자 페이지

#### Day 8-9: 서비스 검색 및 필터링 (450,000원)
**목표**: 서비스 목록 페이지 완성

**백엔드 작업:**
- [ ] 서비스 목록 API (`GET /services`)
- [ ] 검색 기능 (제목, 설명)
- [ ] 필터링 (카테고리, 가격대, 평점)
- [ ] 정렬 (인기순, 최신순, 평점순, 가격순)
- [ ] 페이지네이션
- [ ] 데이터 시딩 (테스트용 서비스 데이터)

**프론트엔드 작업:**
- [ ] 서비스 목록 페이지 (`/services`)
- [ ] 서비스 카드 컴포넌트
- [ ] 그리드 레이아웃 (반응형)
- [ ] 검색 인풋
- [ ] 필터 사이드바 (가격 슬라이더 등)
- [ ] 정렬 드롭다운
- [ ] 페이지네이션 또는 무한 스크롤
- [ ] URL 쿼리 관리 (nuqs)
- [ ] 로딩 스켈레톤

**테스트:**
- [ ] 검색 기능 테스트
- [ ] 필터링 조합 테스트
- [ ] 정렬 기능 테스트

---

#### Day 10-11: 서비스 상세 및 리뷰 (500,000원)
**목표**: 서비스 상세 페이지 및 리뷰 시스템

**백엔드 작업:**
- [ ] 서비스 상세 API (`GET /services/:id`)
- [ ] 리뷰 목록 API (`GET /services/:id/reviews`)
- [ ] 리뷰 작성 API (`POST /services/:id/reviews`)
- [ ] 리뷰 수정 API (`PUT /services/:id/reviews/:reviewId`)
- [ ] 리뷰 삭제 API (`DELETE /services/:id/reviews/:reviewId`)
- [ ] 리뷰 통계 API (`GET /services/:id/reviews/stats`)
- [ ] 이미지 업로드 API (`POST /upload`)
- [ ] 서비스 평점 자동 계산

**프론트엔드 작업:**
- [ ] 서비스 상세 페이지 (`/services/:id`)
- [ ] 이미지 갤러리 (라이트박스)
- [ ] 플랜 선택 UI
- [ ] 리뷰 탭 및 목록
- [ ] 리뷰 작성 모달
- [ ] 별점 선택 컴포넌트
- [ ] 이미지 업로드 (드래그앤드롭)
- [ ] 리뷰 통계 (평점 분포)

**테스트:**
- [ ] 리뷰 CRUD 기능 테스트
- [ ] 이미지 업로드 테스트
- [ ] 평점 계산 검증

---

#### Day 12-13: 주문 프로세스 (200,000원)
**목표**: 주문 페이지 및 관리자 대시보드 기본

**백엔드 작업:**
- [ ] 주문 생성 API (`POST /orders`)
- [ ] 주문 미리보기 API (`GET /orders/preview`) - 선택사항
- [ ] 주문 번호 자동 생성
- [ ] 대시보드 통계 API (`GET /admin/dashboard/stats`)
- [ ] 최근 활동 API (`GET /admin/dashboard/recent-activity`)
- [ ] 매출 차트 API (`GET /admin/dashboard/sales-chart`)

**프론트에드 작업:**
- [ ] 주문하기 페이지 (`/order`)
- [ ] 주문 폼 컴포넌트
- [ ] 약관 동의
- [ ] 주문 요약 섹션
- [ ] 주문 완료 페이지 (`/order/complete`)
- [ ] 관리자 대시보드 (`/admin`)
- [ ] 지표 카드 (매출, 주문수 등)
- [ ] 차트 (라인/바 차트) - Recharts 등

**테스트:**
- [ ] 주문 생성 및 검증
- [ ] 대시보드 데이터 로드 테스트

---

#### Day 14: 관리자 페이지 및 최종 정리 (250,000원)
**목표**: 관리자 기본 기능 및 배포 준비

**백엔드 작업:**
- [ ] 회원 관리 API (`GET /admin/users`, `PUT /admin/users/:id` 등)
- [ ] 서비스 관리 API (`POST /admin/services`, `PUT /admin/services/:id` 등)
- [ ] 주문 관리 API (`PUT /admin/orders/:id/status` 등)
- [ ] 리뷰 관리 API (`PUT /admin/reviews/:id/status` 등)
- [ ] 배너 관리 API (`GET /admin/banners`, `POST /admin/banners` 등)
- [ ] 공지사항 API (`GET /admin/notices`, `POST /admin/notices` 등)
- [ ] 설정 API (`GET /admin/settings`, `PUT /admin/settings` 등)
- [ ] 에러 핸들링 및 검증
- [ ] API 문서화 (Swagger)

**프론트엔드 작업:**
- [ ] 관리자 네비게이션 사이드바
- [ ] 회원 관리 페이지 기본 (`/admin/users`)
- [ ] 서비스 관리 페이지 기본 (`/admin/services`)
- [ ] 주문 관리 페이지 기본 (`/admin/orders`)
- [ ] 최종 UI/UX 검수
- [ ] 반응형 레이아웃 확인
- [ ] 에러 페이지 구현

**배포 준비:**
- [ ] 환경 변수 설정 (프로덕션)
- [ ] 빌드 테스트 (`pnpm build`)
- [ ] 린트 및 타입 체크 (`pnpm lint`, `pnpm check-types`)
- [ ] 보안 검토
- [ ] 성능 최적화

---

## 우선순위 및 의존성

```
┌─ Day 1-2: Setup & API Design
│  ├─ Day 3-4: Auth System ──┐
│  │                          ├─ Day 5-7: User Pages
│  │                          │
│  └─────────────────────────┘
│
├─ Day 8-9: Service Search ──┬─ Day 10-11: Service Detail & Reviews ──┐
│                             │                                        │
│                             └─ Day 12-13: Order & Admin Dashboard ──┤
│                                                                      │
└──────────────────────────────────────────────────────────────────── Day 14: Admin Pages & Deploy
```

---

## 병렬 개발 전략

### 권장 팀 구성
- **백엔드 개발자**: API 개발 (우선순위: Auth → Services → Orders → Admin)
- **프론트엔드 개발자 1**: 사용자 페이지 (Auth → MyPage → Services)
- **프론트엔드 개발자 2** (선택사항): 관리자 페이지 + 공유 컴포넌트

### 개발 순서
1. **병렬**: API Design + UI Component 라이브러리 구축
2. **병렬**: Auth API + Auth Pages
3. **병렬**: Service API + Service Pages
4. **병렬**: Order API + Admin Pages
5. **순차**: 통합 테스트 + 배포

---

## 품질 보증 (QA)

### 자동화 테스트
- [ ] 백엔드 단위 테스트 (Jest)
- [ ] 프론트엔드 컴포넌트 테스트 (Vitest + Testing Library)
- [ ] E2E 테스트 (Cypress/Playwright) - 선택사항

### 수동 테스트
- [ ] 기능 테스트 (각 페이지별)
- [ ] 교차 브라우저 테스트 (Chrome, Safari, Firefox)
- [ ] 모바일 반응형 테스트
- [ ] 접근성 테스트

### 성능 최적화
- [ ] 번들 크기 분석
- [ ] 이미지 최적화 검증
- [ ] API 응답 시간 모니터링
- [ ] 데이터베이스 쿼리 성능

---

## 위험 요소 및 대응

| 위험 요소 | 영향도 | 대응 방안 |
|----------|--------|---------|
| API 지연 | 높음 | 목 데이터로 프론트엔드 먼저 개발 |
| 이미지 업로드 문제 | 중 | AWS S3 또는 클라우드 스토리지 사용 검토 |
| 데이터베이스 성능 | 중 | 초기 인덱싱 및 쿼리 최적화 |
| 요구사항 변경 | 중 | 일일 스탠드업 미팅 |
| 배포 문제 | 중 | 초기부터 CI/CD 파이프라인 구축 |

---

## 체크리스트

### Day 7 체크포인트
- [ ] 인증 시스템 완성 및 테스트
- [ ] 마이페이지 기본 기능 완성
- [ ] 데이터베이스 스키마 확정
- [ ] API 50% 완성

### Day 11 체크포인트
- [ ] 서비스 목록/상세 페이지 완성
- [ ] 리뷰 시스템 완성
- [ ] API 80% 완성
- [ ] 성능 테스트 시작

### Day 14 체크포인트
- [ ] 모든 기능 완성
- [ ] QA 통과
- [ ] 배포 준비 완료
- [ ] 문서화 완료

---

## 추가 고려사항

### 향후 작업 (2주 이후)
1. **결제 시스템 연동** (Toss, Stripe)
2. **이메일/SMS 인증** 실제 구현
3. **고급 검색 필터** (검색어 자동완성)
4. **추천 시스템** (AI 기반)
5. **채팅/메시징** (실시간 고객 지원)
6. **모바일 앱** (React Native)

### 모니터링 및 분석
- Google Analytics 통합
- 에러 트래킹 (Sentry)
- 성능 모니터링 (New Relic, DataDog)

---

## 커뮤니케이션 계획

### 일일 스탠드업 (매일 30분)
- 각 팀원의 진행 상황 공유
- 병목 지점 파악 및 해결

### 주간 리뷰 (매주 금요일)
- 마일스톤 달성도 검토
- 다음 주 계획 수립

### 클라이언트 데모 (Day 7, Day 14)
- 진행 상황 데모
- 피드백 수집
