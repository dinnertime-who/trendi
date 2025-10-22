# TRENDI 개발자 가이드 v2

> 🎯 **목표**: 14일 안에 MVP 배포. 필수 기능만 구현, 선택 기능은 추후 진행

---

## 🚀 Quick Start

```bash
# 1. 환경 설정
cp .env.example .env.local
pnpm install

# 2. DB 실행 & 마이그레이션
docker-compose up -d
cd apps/api && npx drizzle-kit push && cd ../..

# 3. 개발 서버 시작
pnpm dev

# Web: http://localhost:3000
# API: http://localhost:8000
# DB Studio: cd apps/api && npx drizzle-kit studio
```

---

## 📁 프로젝트 구조 (간소화)

```
apps/
├── web/src/
│   ├── app/(auth)/         # 로그인, 회원가입
│   ├── app/(user)/         # 마이페이지
│   ├── app/services/       # 서비스 목록/상세
│   ├── app/admin/          # 관리자
│   ├── components/ui/      # Radix UI 컴포넌트
│   ├── lib/api/           # API 클라이언트
│   └── stores/            # Zustand 스토어
│
└── api/src/
    ├── modules/           # NestJS 모듈 (auth, user, service)
    ├── common/           # 공통 (guards, filters, dto)
    └── db/               # Drizzle ORM
```

---

## 🔑 핵심 기능 우선순위 (MVP)

### ✅ 필수 (1주차)
1. **인증**: 로그인/회원가입 (이메일만, 소셜 로그인 제외)
2. **서비스 목록**: 페이징만 (검색/필터 제외)
3. **서비스 상세**: 정보 표시만 (리뷰 제외)
4. **주문**: 단순 주문 생성만

### ⏸️ 2주차
5. 관리자 대시보드
6. 검색/필터
7. 리뷰 시스템

### ❌ MVP 이후
- 소셜 로그인
- 결제 연동
- 이메일 발송
- 실시간 알림

---

## 💾 데이터베이스 스키마 (핵심만)

```typescript
// apps/api/src/db/schema/index.ts

// 1. users - 사용자
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  name: varchar('name', { length: 100 }).notNull(),
  role: varchar('role', { length: 20 }).default('user'), // 'user' | 'admin'
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
  emailIdx: index('idx_users_email').on(table.email),
}));

// 2. services - 서비스
export const services = pgTable('services', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description').notNull(),
  categoryId: integer('category_id'),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  imageUrl: text('image_url'),
  createdAt: timestamp('created_at').defaultNow(),
  status: varchar('status', { length: 20 }).default('published'),
}, (table) => ({
  categoryIdx: index('idx_services_category').on(table.categoryId),
  statusIdx: index('idx_services_status').on(table.status),
}));

// 3. orders - 주문
export const orders = pgTable('orders', {
  id: serial('id').primaryKey(),
  orderNumber: varchar('order_number', { length: 50 }).notNull().unique(),
  userId: integer('user_id').notNull().references(() => users.id),
  serviceId: integer('service_id').notNull().references(() => services.id),
  totalAmount: decimal('total_amount', { precision: 10, scale: 2 }).notNull(),
  status: varchar('status', { length: 20 }).default('pending'),
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => ({
  userIdx: index('idx_orders_user').on(table.userId),
  statusIdx: index('idx_orders_status').on(table.status),
}));

// 4. categories - 카테고리
export const categories = pgTable('categories', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull().unique(),
  slug: varchar('slug', { length: 100 }).notNull().unique(),
});
```

---

## 🔌 API 명세 (실전 코드 포함)

### 1. 인증 API

#### POST /auth/register
```typescript
// DTO
export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsString()
  @MinLength(2)
  name: string;
}

// Controller
@Post('register')
async register(@Body() dto: RegisterDto) {
  const hashedPassword = await bcrypt.hash(dto.password, 10);

  try {
    const user = await db.insert(users).values({
      email: dto.email,
      passwordHash: hashedPassword,
      name: dto.name,
    }).returning();

    return { success: true, data: { id: user[0].id, email: user[0].email } };
  } catch (error) {
    if (error.code === '23505') { // Unique violation
      throw new ConflictException('이미 존재하는 이메일입니다');
    }
    throw error;
  }
}
```

#### POST /auth/login
```typescript
// DTO
export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}

// Response
interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: number;
    email: string;
    name: string;
    role: string;
  };
}

// Controller
@Post('login')
async login(@Body() dto: LoginDto): Promise<LoginResponse> {
  const user = await db.select().from(users)
    .where(eq(users.email, dto.email))
    .limit(1);

  if (!user[0] || !(await bcrypt.compare(dto.password, user[0].passwordHash))) {
    throw new UnauthorizedException('이메일 또는 비밀번호가 틀렸습니다');
  }

  const payload = { sub: user[0].id, email: user[0].email, role: user[0].role };

  return {
    accessToken: this.jwtService.sign(payload, { expiresIn: '15m' }),
    refreshToken: this.jwtService.sign(payload, { expiresIn: '7d' }),
    user: {
      id: user[0].id,
      email: user[0].email,
      name: user[0].name,
      role: user[0].role,
    },
  };
}
```

### 2. 서비스 API

#### GET /services
```typescript
// Query DTO
export class GetServicesDto {
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  page?: number = 1;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  limit?: number = 20;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  categoryId?: number;

  @IsOptional()
  @IsIn(['latest', 'price_asc', 'price_desc'])
  sort?: string = 'latest';
}

// Response
interface ServiceListResponse {
  items: Array<{
    id: number;
    title: string;
    description: string;
    price: string;
    imageUrl: string | null;
    categoryId: number | null;
    createdAt: Date;
  }>;
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

// Controller
@Get()
async getServices(@Query() query: GetServicesDto): Promise<ServiceListResponse> {
  const offset = (query.page - 1) * query.limit;

  // Build where conditions
  const conditions = [];
  if (query.search) {
    conditions.push(like(services.title, `%${query.search}%`));
  }
  if (query.categoryId) {
    conditions.push(eq(services.categoryId, query.categoryId));
  }
  conditions.push(eq(services.status, 'published'));

  // Build order
  let orderBy;
  switch (query.sort) {
    case 'price_asc':
      orderBy = asc(services.price);
      break;
    case 'price_desc':
      orderBy = desc(services.price);
      break;
    default:
      orderBy = desc(services.createdAt);
  }

  // Execute queries
  const [items, totalResult] = await Promise.all([
    db.select().from(services)
      .where(and(...conditions))
      .orderBy(orderBy)
      .limit(query.limit)
      .offset(offset),
    db.select({ count: count() }).from(services)
      .where(and(...conditions))
  ]);

  const total = totalResult[0].count;

  return {
    items,
    pagination: {
      total,
      page: query.page,
      limit: query.limit,
      pages: Math.ceil(total / query.limit),
    },
  };
}
```

#### GET /services/:id
```typescript
@Get(':id')
async getService(@Param('id', ParseIntPipe) id: number) {
  const service = await db.select().from(services)
    .where(eq(services.id, id))
    .limit(1);

  if (!service[0]) {
    throw new NotFoundException('서비스를 찾을 수 없습니다');
  }

  return { success: true, data: service[0] };
}
```

### 3. 주문 API

#### POST /orders
```typescript
// DTO
export class CreateOrderDto {
  @IsInt()
  serviceId: number;
}

// Controller
@Post()
@UseGuards(JwtAuthGuard)
async createOrder(
  @Body() dto: CreateOrderDto,
  @Request() req
) {
  // 서비스 조회
  const service = await db.select().from(services)
    .where(eq(services.id, dto.serviceId))
    .limit(1);

  if (!service[0]) {
    throw new NotFoundException('서비스를 찾을 수 없습니다');
  }

  // 주문번호 생성 (YYYYMMDD-XXXXXX)
  const orderNumber = `${format(new Date(), 'yyyyMMdd')}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

  // 주문 생성
  const order = await db.insert(orders).values({
    orderNumber,
    userId: req.user.sub,
    serviceId: dto.serviceId,
    totalAmount: service[0].price,
    status: 'pending',
  }).returning();

  return {
    success: true,
    data: {
      id: order[0].id,
      orderNumber: order[0].orderNumber,
      service: service[0],
      totalAmount: order[0].totalAmount,
      status: order[0].status,
    }
  };
}
```

---

## 🎨 프론트엔드 구현 가이드

### 1. API 클라이언트 설정

```typescript
// apps/web/src/lib/api/client.ts
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// Request interceptor - 토큰 자동 첨부
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor - 토큰 갱신
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const { data } = await axios.post(`${API_BASE_URL}/auth/refresh`, {
          refreshToken,
        });

        localStorage.setItem('accessToken', data.accessToken);
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;

        return apiClient(originalRequest);
      } catch (refreshError) {
        // 리프레시 실패 - 로그아웃
        localStorage.clear();
        window.location.href = '/sign-in';
      }
    }

    return Promise.reject(error);
  }
);
```

### 2. React Query 훅 예제

```typescript
// apps/web/src/hooks/useServices.ts
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';

interface ServiceListParams {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: number;
  sort?: string;
}

export const useServices = (params: ServiceListParams = {}) => {
  return useQuery({
    queryKey: ['services', params],
    queryFn: async () => {
      const { data } = await apiClient.get('/services', { params });
      return data;
    },
    staleTime: 1000 * 60 * 5, // 5분
  });
};

export const useService = (id: number) => {
  return useQuery({
    queryKey: ['service', id],
    queryFn: async () => {
      const { data } = await apiClient.get(`/services/${id}`);
      return data;
    },
    enabled: !!id,
  });
};
```

### 3. Zustand 스토어 예제

```typescript
// apps/web/src/stores/authStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: number;
  email: string;
  name: string;
  role: string;
}

interface AuthStore {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;

  login: (data: LoginResponse) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
  isAdmin: () => boolean;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,

      login: (data) => {
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
        set({
          user: data.user,
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
        });
      },

      logout: () => {
        localStorage.clear();
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
        });
      },

      isAuthenticated: () => !!get().user,

      isAdmin: () => get().user?.role === 'admin',
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user }),
    }
  )
);
```

### 4. 컴포넌트 예제

```tsx
// apps/web/src/app/services/page.tsx
'use client';

import { useServices } from '@/hooks/useServices';
import { useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function ServicesPage() {
  const searchParams = useSearchParams();
  const [page, setPage] = useState(1);

  const { data, isLoading, error } = useServices({
    page,
    search: searchParams.get('search') || undefined,
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-64 bg-gray-200 animate-pulse rounded" />
        ))}
      </div>
    );
  }

  if (error) {
    return <div>오류가 발생했습니다.</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">서비스 목록</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {data?.items.map((service: any) => (
          <div key={service.id} className="border rounded p-4">
            <h2 className="font-semibold">{service.title}</h2>
            <p className="text-gray-600 mt-2">{service.description}</p>
            <p className="text-lg font-bold mt-4">₩{service.price}</p>
            <Link href={`/services/${service.id}`}>
              <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
                자세히 보기
              </button>
            </Link>
          </div>
        ))}
      </div>

      {/* 페이지네이션 */}
      <div className="flex justify-center mt-8 gap-2">
        {[...Array(data?.pagination.pages || 1)].map((_, i) => (
          <button
            key={i}
            onClick={() => setPage(i + 1)}
            className={`px-4 py-2 rounded ${
              page === i + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}
```

---

## 🚨 에러 처리 표준

### HTTP 상태 코드
```typescript
// 성공
200 OK - 조회, 수정 성공
201 Created - 생성 성공
204 No Content - 삭제 성공

// 클라이언트 에러
400 Bad Request - 잘못된 요청 (검증 실패)
401 Unauthorized - 인증 필요
403 Forbidden - 권한 없음
404 Not Found - 리소스 없음
409 Conflict - 충돌 (중복 등)

// 서버 에러
500 Internal Server Error - 서버 오류
```

### 에러 응답 형식
```typescript
interface ErrorResponse {
  success: false;
  error: {
    code: string;        // 'VALIDATION_ERROR'
    message: string;     // '입력값이 올바르지 않습니다'
    details?: any;       // { email: '이메일 형식이 아닙니다' }
    timestamp: string;   // ISO 8601
    path: string;        // '/auth/login'
  };
}
```

### 에러 코드
```typescript
enum ErrorCode {
  // 인증
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',

  // 검증
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  DUPLICATE_EMAIL = 'DUPLICATE_EMAIL',

  // 리소스
  NOT_FOUND = 'NOT_FOUND',
  ALREADY_EXISTS = 'ALREADY_EXISTS',

  // 서버
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  DATABASE_ERROR = 'DATABASE_ERROR',
}
```

---

## 🧪 테스트 가이드

### 백엔드 테스트 (우선순위)
```typescript
// 1. 인증 테스트 (필수)
describe('AuthService', () => {
  it('should register user', async () => {});
  it('should not register duplicate email', async () => {});
  it('should login with valid credentials', async () => {});
  it('should not login with invalid password', async () => {});
});

// 2. 서비스 테스트 (필수)
describe('ServicesService', () => {
  it('should return paginated services', async () => {});
  it('should filter by category', async () => {});
  it('should search by title', async () => {});
});

// 3. 주문 테스트 (필수)
describe('OrdersService', () => {
  it('should create order', async () => {});
  it('should not create order for non-existent service', async () => {});
});
```

### 프론트엔드 테스트 (선택)
```typescript
// 로그인 폼 테스트
describe('LoginForm', () => {
  it('should validate email format', async () => {});
  it('should require password', async () => {});
  it('should call login API on submit', async () => {});
});
```

---

## 📅 일일 체크리스트

### Day 1-2: 기초 설정
- [ ] DB 스키마 작성 (4개 테이블만)
- [ ] NestJS 모듈 생성 (auth, services, orders)
- [ ] JWT 설정
- [ ] CORS 설정
- [ ] Drizzle ORM 연결 테스트

### Day 3-4: 인증
- [ ] `POST /auth/register` 구현
- [ ] `POST /auth/login` 구현
- [ ] JWT Guard 작성
- [ ] 로그인/회원가입 페이지 UI
- [ ] 인증 상태 관리 (Zustand)

### Day 5-6: 서비스 목록
- [ ] `GET /services` (페이징만)
- [ ] 테스트 데이터 시딩 (20개)
- [ ] 서비스 목록 페이지
- [ ] 서비스 카드 컴포넌트
- [ ] 페이지네이션

### Day 7-8: 서비스 상세 & 주문
- [ ] `GET /services/:id` 구현
- [ ] `POST /orders` 구현
- [ ] 서비스 상세 페이지
- [ ] 주문 버튼 & 확인 모달
- [ ] 주문 완료 페이지

### Day 9-10: 마이페이지
- [ ] `GET /user/profile` 구현
- [ ] `GET /user/orders` 구현
- [ ] 마이페이지 레이아웃
- [ ] 주문 내역 표시

### Day 11-12: 관리자 기본
- [ ] `GET /admin/dashboard/stats` 구현
- [ ] `GET /admin/services` 구현
- [ ] 관리자 대시보드 페이지
- [ ] 서비스 관리 페이지 (목록만)

### Day 13: 검색/필터 추가
- [ ] `GET /services` 검색/필터 추가
- [ ] 검색바 UI
- [ ] 필터 UI (카테고리만)

### Day 14: 마무리
- [ ] 에러 페이지 (404, 500)
- [ ] 로딩 상태 개선
- [ ] 빌드 테스트
- [ ] 배포 준비

---

## 🔧 환경 변수

```bash
# apps/web/.env.local
NEXT_PUBLIC_API_URL=http://localhost:8000

# apps/api/.env
PORT=8000
DATABASE_URL=postgresql://postgres:password@localhost:51000/trendi
JWT_SECRET=your-secret-key-change-this-in-production
JWT_EXPIRES_IN=900           # 15분
REFRESH_TOKEN_EXPIRES_IN=604800  # 7일
```

---

## 🚢 배포 체크리스트

### 배포 전
- [ ] 환경 변수 설정 (프로덕션)
- [ ] JWT_SECRET 변경 (강력한 값)
- [ ] DB 마이그레이션 실행
- [ ] 빌드 확인 (`pnpm build`)
- [ ] 타입 체크 (`pnpm check-types`)
- [ ] 린트 통과 (`pnpm lint`)

### 배포 후
- [ ] 헬스체크 API 확인 (`GET /health`)
- [ ] 로그인 테스트
- [ ] 서비스 목록 로드 테스트
- [ ] 주문 생성 테스트

---

## 📝 커밋 메시지 규칙

```bash
feat: 새 기능
fix: 버그 수정
docs: 문서 수정
style: 코드 포맷팅
refactor: 코드 리팩토링
test: 테스트 추가
chore: 빌드 작업 등
```

예시:
```bash
feat(api): 회원가입 API 구현
fix(web): 로그인 후 리다이렉트 오류 수정
```

---

## ⚡ 트러블슈팅

### 자주 발생하는 문제

1. **CORS 에러**
   ```typescript
   // apps/api/src/main.ts
   app.enableCors({
     origin: ['http://localhost:3000', 'http://localhost:3001'],
     credentials: true,
   });
   ```

2. **JWT 토큰 만료**
   ```typescript
   // 자동 갱신 로직이 apiClient에 구현되어 있음
   // localStorage에 refreshToken이 있는지 확인
   ```

3. **DB 연결 실패**
   ```bash
   # Docker 실행 확인
   docker ps

   # DB 재시작
   docker-compose restart postgres
   ```

4. **타입 에러**
   ```bash
   # 타입 재생성
   cd apps/api
   npx drizzle-kit generate
   ```

---

## 📚 참고 문서

- [Next.js 15 Docs](https://nextjs.org/docs)
- [NestJS Docs](https://docs.nestjs.com)
- [Drizzle ORM](https://orm.drizzle.team)
- [TanStack Query](https://tanstack.com/query)
- [Zustand](https://zustand-demo.pmnd.rs)