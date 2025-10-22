# 기술 스택 및 구현 가이드

---

## 1. 프론트엔드 기술 스택

### 핵심 라이브러리
- **Next.js 15**: App Router 기반의 풀스택 프레임워크
- **React 19**: UI 라이브러리 (React Compiler 포함)
- **TypeScript**: 타입 안정성
- **Tailwind CSS 4**: 유틸리티 기반 스타일링
- **Radix UI**: 접근성 높은 컴포넌트 라이브러리

### 상태 관리 및 데이터 페칭
- **Zustand**: 클라이언트 상태 관리 (간단하고 빠름)
- **TanStack Query v5**: 서버 상태 관리 (캐싱, 동기화)
- **nuqs**: URL 쿼리 파라미터 관리 (필터, 검색)

### 추가 라이브러리
- **axios**: HTTP 클라이언트
- **Recharts**: 차트 시각화 (관리자 대시보드)
- **react-hot-toast**: 알림 UI
- **clsx/cn**: 클래스명 병합
- **zod**: 스키마 검증

### 개발 도구
- **Biome**: 린팅 및 포매팅 (ESLint + Prettier 대체)
- **Turborepo**: 모노레포 태스크 오케스트레이션
- **Vitest**: 단위 테스트 (선택사항)
- **Testing Library**: 컴포넌트 테스트

---

## 2. 백엔드 기술 스택

### 핵심 프레임워크 및 라이브러리
- **NestJS**: Node.js 풀 프레임워크
- **Express**: HTTP 서버 (NestJS의 기본 HTTP 어댑터)
- **TypeScript**: 타입 안정성

### 데이터베이스
- **PostgreSQL**: 관계형 데이터베이스
- **Drizzle ORM**: 타입 안전 ORM
- **Database**: Docker Compose로 로컬 개발 환경 제공 (포트 51000)

### 인증 및 보안
- **JWT**: 토큰 기반 인증
- **bcryptjs**: 비밀번호 해싱
- **@nestjs/passport**: Passport 인증 전략
- **CORS**: 도메인 간 요청 허용 설정

### 유틸리티
- **dotenv**: 환경 변수 관리
- **class-validator**: DTO 검증
- **multer**: 파일 업로드
- **axios**: HTTP 요청

### 개발 도구
- **Jest**: 단위 테스트
- **Swagger/OpenAPI**: API 문서화
- **TypeORM migrations** (또는 Drizzle Kit): 데이터베이스 마이그레이션

---

## 3. 인프라 및 배포

### 개발 환경
- **Docker Compose**
  - PostgreSQL (포트 51000)
  - Redis (포트 56379, 선택사항)

### 환경 변수 (.env)
```env
# API
PORT=8000
DATABASE_URL=postgresql://user:password@localhost:51000/trendi
ALLOWED_ORIGIN=http://localhost:3000,http://localhost:3001

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRATION=900        # 15분 (초 단위)
REFRESH_TOKEN_EXPIRATION=604800  # 7일 (초 단위)

# 파일 업로드
UPLOAD_DIR=./uploads      # 로컬 저장소 또는 S3
AWS_S3_BUCKET=            # AWS S3 사용 시
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=

# 이메일 (선택사항)
MAIL_HOST=
MAIL_PORT=
MAIL_USER=
MAIL_PASSWORD=

# 소셜 로그인 (선택사항)
KAKAO_CLIENT_ID=
KAKAO_CLIENT_SECRET=
NAVER_CLIENT_ID=
NAVER_CLIENT_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

---

## 4. 프로젝트 구조

### 프론트엔드 (apps/web)
```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # 인증 관련 페이지 (로그인, 회원가입)
│   ├── (user)/            # 사용자 페이지 (마이페이지, 주문)
│   ├── (admin)/           # 관리자 페이지
│   ├── services/          # 서비스 페이지 (검색, 상세)
│   └── layout.tsx         # 루트 레이아웃 (프로바이더 포함)
├── components/
│   ├── ui/                # Radix UI 기반 기본 컴포넌트
│   ├── forms/             # 폼 컴포넌트 (로그인, 회원가입 등)
│   ├── tables/            # 테이블 컴포넌트 (관리자)
│   ├── cards/             # 카드 컴포넌트
│   └── layout/            # 레이아웃 컴포넌트 (Header, Sidebar)
├── hooks/                 # 커스텀 React 훅
├── lib/
│   ├── api.ts            # API 클라이언트 설정
│   ├── env.ts            # 환경 변수 검증
│   ├── utils.ts          # 유틸리티 함수
│   └── react-query.ts    # TanStack Query 설정
├── stores/               # Zustand 스토어
├── types/                # TypeScript 타입 정의
└── config/               # 설정 파일
```

### 백엔드 (apps/api)
```
src/
├── main.ts               # 애플리케이션 엔트리포인트
├── app.module.ts         # 루트 NestJS 모듈
├── auth/                 # 인증 모듈
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── jwt.strategy.ts
│   └── auth.module.ts
├── users/                # 사용자 모듈
│   ├── users.controller.ts
│   ├── users.service.ts
│   └── users.module.ts
├── services/             # 서비스 모듈
├── orders/               # 주문 모듈
├── reviews/              # 리뷰 모듈
├── admin/                # 관리자 모듈
├── common/               # 공유 모듈
│   ├── filters/          # 예외 필터
│   ├── guards/           # 인증/권한 가드
│   ├── interceptors/     # 요청/응답 인터셉터
│   └── dto/              # 공유 DTO
├── db/
│   ├── schema/           # Drizzle ORM 스키마
│   ├── db.ts             # 데이터베이스 클라이언트
│   └── util/             # 데이터베이스 유틸리티
└── config/               # 설정 파일
```

---

## 5. 주요 구현 가이드

### 인증 플로우
```typescript
// 1. 로그인
POST /auth/login
{ email, password }
→ JWT 토큰 발급 → 쿠키에 저장

// 2. API 요청
GET /user/profile
Authorization: Bearer <access_token>

// 3. 토큰 갱신
POST /auth/refresh-token
Refresh-Token: <refresh_token>
→ 새 Access Token 발급

// 4. 로그아웃
POST /auth/logout
→ 토큰 무효화 (쿠키 삭제)
```

### 사용자 정보 조회
```typescript
// auth.guard.ts: JWT 검증 미들웨어
// users.service.ts: 사용자 정보 조회

@UseGuards(JwtAuthGuard)
@Get('profile')
getProfile(@Request() req) {
  return this.usersService.findById(req.user.id);
}
```

### 이미지 업로드
```typescript
// files.controller.ts
@Post('upload')
@UseInterceptors(FileInterceptor('file'))
uploadFile(@UploadedFile() file: Express.Multer.File) {
  // S3 또는 로컬 저장소에 업로드
  // 파일 URL 반환
}
```

### 데이터 페이징
```typescript
// Query 파라미터
GET /services?page=1&limit=20&sort=latest

// 응답 형식
{
  success: true,
  data: {
    items: [...],
    total: 100,
    page: 1,
    limit: 20,
    pages: 5
  }
}
```

### 필터링 및 검색
```typescript
// Query 파라미터
GET /services?search=coding&category=tech&minPrice=10000&maxPrice=100000&sort=price_asc

// Drizzle ORM 쿼리
const services = await db.select()
  .from(servicesTable)
  .where(and(
    like(servicesTable.title, `%${search}%`),
    eq(servicesTable.categoryId, categoryId),
    gte(servicesTable.price, minPrice),
    lte(servicesTable.price, maxPrice)
  ))
  .orderBy(desc(servicesTable.createdAt))
  .limit(limit)
  .offset((page - 1) * limit);
```

---

## 6. 성능 최적화 전략

### 프론트엔드
- **이미지 최적화**: Next.js `<Image>` 컴포넌트 사용
- **코드 스플리팅**: 동적 import (`React.lazy`)
- **가상화**: 긴 리스트에 대해 가상 스크롤링 적용
- **캐싱**: TanStack Query의 캐싱 활용
- **번들 분석**: `next/bundle-analyzer`로 번들 크기 모니터링

### 백엔드
- **데이터베이스 인덱싱**: 자주 조회되는 컬럼 인덱싱
- **쿼리 최적화**: N+1 문제 해결 (eager loading)
- **캐싱**: Redis 활용 (세션, 통계 등)
- **동적 필드 선택**: GraphQL처럼 필요한 필드만 조회
- **Pagination**: 모든 목록 조회에 페이징 적용

---

## 7. 보안 고려사항

### 프론트엔드
- [ ] CSRF 토큰 검증 (HTTP-Only 쿠키)
- [ ] XSS 방지 (React의 자동 이스케이핑)
- [ ] 민감한 정보를 localStorage에 저장하지 않기
- [ ] 입력 검증 (Zod)

### 백엔드
- [ ] SQL Injection 방지 (ORM 사용)
- [ ] Rate Limiting (DDoS 방지)
- [ ] CORS 설정 (신뢰할 수 있는 도메인만 허용)
- [ ] HTTPS (프로덕션)
- [ ] 비밀번호 해싱 (bcryptjs)
- [ ] JWT 서명 (HS256 또는 RS256)

---

## 8. 개발 워크플로우

### 로컬 개발 시작
```bash
# 1. 의존성 설치
pnpm install

# 2. 데이터베이스 시작
docker-compose up -d

# 3. 마이그레이션 적용
cd apps/api
npx drizzle-kit push

# 4. 개발 서버 시작
cd ../..
pnpm dev

# 5. 브라우저 열기
# 웹: http://localhost:3000
# API: http://localhost:8000
```

### 새 기능 개발
```bash
# 1. 새 브랜치 생성
git checkout -b feature/new-feature

# 2. 개발
pnpm dev

# 3. 테스트
pnpm test

# 4. 린트 및 포매팅
pnpm lint
pnpm format

# 5. 커밋
git add .
git commit -m "feat: new feature description"

# 6. PR 생성
git push origin feature/new-feature
```

---

## 9. 테스트 전략

### 백엔드 테스트 (Jest)
```typescript
// users.service.spec.ts
describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should find a user by id', async () => {
    const user = await service.findById(1);
    expect(user).toBeDefined();
    expect(user.id).toBe(1);
  });
});
```

### 프론트엔드 컴포넌트 테스트 (Vitest + Testing Library)
```typescript
// Button.spec.ts
import { render, screen } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('renders with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Click me</Button>);
    await userEvent.click(screen.getByText('Click me'));
    expect(onClick).toHaveBeenCalled();
  });
});
```

---

## 10. 모니터링 및 로깅

### 백엔드 로깅
```typescript
// logger.interceptor.ts
@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    const request = context.switchToHttp().getRequest();
    console.log(`[${new Date().toISOString()}] ${request.method} ${request.url}`);

    return next.handle().pipe(
      tap(() => {
        console.log('Response sent successfully');
      }),
      catchError((error) => {
        console.error('Error:', error);
        throw error;
      }),
    );
  }
}
```

### 에러 트래킹 (Sentry)
```typescript
// main.ts
import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
});

app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.errorHandler());
```

---

## 11. 배포 체크리스트

### 프로덕션 배포 전
- [ ] 환경 변수 설정 (프로덕션 값)
- [ ] 데이터베이스 마이그레이션 완료
- [ ] 시크릿 관리 (API 키, JWT 시크릿 등)
- [ ] HTTPS 설정
- [ ] CORS 도메인 설정
- [ ] 로깅 및 모니터링 설정
- [ ] 백업 정책 수립
- [ ] 성능 테스트 완료
- [ ] 보안 검토 완료

### 배포 후
- [ ] 헬스 체크 실행
- [ ] 모니터링 대시보드 확인
- [ ] 실제 데이터 테스트
- [ ] 알림 설정 확인

---

## 12. 추천 라이브러리

### 프론트엔드
| 용도 | 라이브러리 | 설명 |
|------|----------|------|
| 폼 관리 | `react-hook-form` | 가볍고 성능 좋음 |
| 검증 | `zod` | TypeScript 타입 검증 |
| 알림 | `react-hot-toast` | 사용자 친화적 알림 |
| 차트 | `recharts` | React 컴포넌트 기반 |
| 날짜 | `date-fns` | 경량 날짜 라이브러리 |
| 클립보드 | `react-copy-to-clipboard` | 클립보드 복사 |

### 백엔드
| 용도 | 라이브러리 | 설명 |
|------|----------|------|
| 검증 | `class-validator` | DTO 검증 |
| 해시 | `bcryptjs` | 비밀번호 해싱 |
| JWT | `@nestjs/jwt` | JWT 토큰 관리 |
| 파일 | `multer` | 파일 업로드 |
| ORM | `drizzle-orm` | 타입 안전 ORM |
