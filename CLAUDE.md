# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 중요: 언어 설정

**모든 응답과 커뮤니케이션은 한국어로 작성해야 합니다.** 이 레포지토리는 한국 사용자를 대상으로 하며, 코드 설명, 커밋 메시지, PR 설명, 모든 대화는 한국어로 진행되어야 합니다.

## 프로젝트 개요

Next.js 웹 애플리케이션과 NestJS API 백엔드를 포함하는 Turborepo 모노레포입니다. pnpm을 패키지 매니저로 사용하며 Node.js >=22가 필요합니다.

## 아키텍처

### 모노레포 구조

- `apps/web`: Next.js 15 프론트엔드 애플리케이션 (React 19)
- `apps/api`: NestJS 백엔드 API (PostgreSQL 데이터베이스)
- `packages/utils`: 공유 유틸리티 패키지

### 주요 기술 스택

**웹 앱:**
- Next.js 15 (App Router, Turbopack)
- React 19 (React Compiler 포함)
- TanStack Query (데이터 페칭)
- Radix UI 컴포넌트 + Tailwind CSS 4
- nuqs (URL 상태 관리)
- Zustand (클라이언트 상태 관리)
- Biome (린팅 및 포매팅)
- Pretendard 폰트 사용

**API:**
- NestJS 프레임워크
- Drizzle ORM + PostgreSQL
- 모바일/웹 클라이언트용 CORS 설정
- dotenv로 환경 변수 관리

**인프라:**
- PostgreSQL (포트 51000, Docker Compose)
- Redis (포트 56379, Docker Compose)
- 데이터베이스 파일: `./database`
- Redis 데이터: `./redis-data`

## 개발 명령어

### 모노레포 전체 명령어

```bash
# 의존성 설치
pnpm install

# 모든 앱 개발 모드 실행
pnpm dev

# 모든 앱 빌드
pnpm build

# 모든 앱 린트
pnpm lint

# 모든 코드 포맷
pnpm format

# 모든 앱 타입 체크
pnpm check-types
```

### 애플리케이션별 명령어

```bash
# 웹 앱만
pnpm dev:web          # Next.js 개발 서버 시작
pnpm build:web        # 프로덕션 빌드
pnpm start:web        # 프로덕션 서버 시작
pnpm lint:web         # 웹 앱 린트
pnpm format:web       # 웹 앱 포맷

# API만
pnpm dev:api          # NestJS watch 모드로 시작
pnpm build:api        # API 빌드
pnpm start:api        # 프로덕션 API 서버 시작
pnpm lint:api         # API 린트
pnpm format:api       # API 포맷
```

### 데이터베이스 관리

Drizzle ORM이 API에 설정되어 있으며 스키마는 `apps/api/src/db/schema/index.ts`에 있습니다.

```bash
# 마이그레이션 생성 (apps/api 디렉토리에서)
cd apps/api
npx drizzle-kit generate

# 스키마 변경사항 푸시
npx drizzle-kit push

# Drizzle Studio 열기
npx drizzle-kit studio
```

### 인프라

```bash
# PostgreSQL과 Redis 시작
docker-compose up -d

# 서비스 중지
docker-compose down
```

## 코드 구조

### 웹 앱 구조

- `apps/web/src/app`: Next.js App Router 페이지 및 레이아웃
- `apps/web/src/components/ui`: Radix UI 기반 컴포넌트 라이브러리
- `apps/web/src/components/dialog-service`: 다이얼로그 관리 서비스
- `apps/web/src/lib/react-query`: TanStack Query 설정
- `apps/web/src/config/font`: 폰트 설정 (Pretendard)
- `apps/web/src/hooks`: 커스텀 React 훅

**중요 파일:**
- [apps/web/src/app/layout.tsx](apps/web/src/app/layout.tsx): 프로바이더가 포함된 루트 레이아웃 (ReactQueryProvider, NuqsAdapter)
- [apps/web/src/lib/env.ts](apps/web/src/lib/env.ts): 환경 변수 검증
- [apps/web/src/lib/utils.ts](apps/web/src/lib/utils.ts): 유틸리티 함수 (클래스 병합용 `cn()` 포함)

### API 구조

- `apps/api/src/app.module.ts`: 루트 NestJS 모듈
- `apps/api/src/main.ts`: CORS 설정이 포함된 애플리케이션 부트스트랩
- `apps/api/src/db/db.ts`: Drizzle 데이터베이스 클라이언트 초기화
- `apps/api/src/db/schema`: 데이터베이스 스키마 정의
- `apps/api/src/db/util`: 데이터베이스 유틸리티 함수
- `apps/api/src/lib/auth.ts`: 인증 유틸리티

**필수 환경 변수:**
- `DATABASE_URL`: PostgreSQL 연결 문자열
- `PORT`: API 서버 포트 (기본값: 8000)
- `ALLOWED_ORIGIN`: CORS 허용 origin 목록 (쉼표로 구분)

## 도구 설정

### Biome 설정

루트 레벨에서 Biome이 설정되어 있습니다:
- 2칸 들여쓰기
- 사용하지 않는 import는 에러 처리
- Next.js와 React 도메인별 규칙 적용
- 저장 시 import 자동 정리
- 접근성 및 스타일 규칙 커스터마이징

### Turbo 설정

Turborepo가 태스크 오케스트레이션을 담당합니다:
- `build`: `.next/**`와 `dist/**`에 출력물 캐시
- `dev`: 캐싱 없음, 지속적 실행
- `lint`: 모든 워크스페이스에서 실행
- 모든 태스크는 `^build`, `^lint` 등으로 의존성 체이닝 지원

## 중요 사항

- 웹 앱은 기본적으로 한국어 로케일(`lang="ko"`)을 사용합니다
- CORS는 인증을 위해 credentials를 허용하도록 설정되어 있습니다
- 데이터베이스는 충돌 방지를 위해 비표준 포트 51000에서 실행됩니다
- Redis는 포트 56379에서 실행됩니다
- Next.js와 NestJS 모두 빠른 빌드를 위해 Turbopack/SWC를 사용합니다
- API는 Jest로 테스트가 설정되어 있습니다 (rootDir: `src`, 테스트 파일: `*.spec.ts`)
