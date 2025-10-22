# API 및 데이터베이스 설계

---

## 1. 데이터베이스 스키마

### 1.1 사용자 관련 테이블

#### `users` 테이블
```sql
-- 회원 정보
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  profile_image_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
  last_login_at TIMESTAMP
);
```

#### `user_accounts` 테이블
```sql
-- 환불 계좌 정보
CREATE TABLE user_accounts (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  bank_name VARCHAR(50) NOT NULL,
  account_number VARCHAR(30) NOT NULL,
  account_holder VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### `oauth_accounts` 테이블
```sql
-- 소셜 로그인 연결
CREATE TABLE oauth_accounts (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  provider ENUM('kakao', 'naver', 'google') NOT NULL,
  provider_id VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(provider, provider_id)
);
```

---

### 1.2 서비스 관련 테이블

#### `services` 테이블
```sql
-- 서비스 정보
CREATE TABLE services (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  category_id INTEGER REFERENCES categories(id),
  created_by INTEGER NOT NULL REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status ENUM('published', 'draft', 'archived') DEFAULT 'draft',
  banner_image_url TEXT,
  average_rating DECIMAL(3, 2) DEFAULT 0,
  review_count INTEGER DEFAULT 0
);
```

#### `service_plans` 테이블
```sql
-- 서비스 플랜
CREATE TABLE service_plans (
  id SERIAL PRIMARY KEY,
  service_id INTEGER NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  duration_days INTEGER,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### `service_images` 테이블
```sql
-- 서비스 이미지
CREATE TABLE service_images (
  id SERIAL PRIMARY KEY,
  service_id INTEGER NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### `categories` 테이블
```sql
-- 서비스 카테고리
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

### 1.3 주문 관련 테이블

#### `orders` 테이블
```sql
-- 주문 정보
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  order_number VARCHAR(50) NOT NULL UNIQUE,
  user_id INTEGER NOT NULL REFERENCES users(id),
  service_id INTEGER NOT NULL REFERENCES services(id),
  plan_id INTEGER NOT NULL REFERENCES service_plans(id),
  total_amount DECIMAL(10, 2) NOT NULL,
  status ENUM('pending', 'processing', 'completed', 'cancelled', 'refunded') DEFAULT 'pending',
  payment_status ENUM('unpaid', 'paid', 'refunded') DEFAULT 'unpaid',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  scheduled_date TIMESTAMP,
  completed_date TIMESTAMP
);
```

---

### 1.4 리뷰 관련 테이블

#### `reviews` 테이블
```sql
-- 리뷰 정보
CREATE TABLE reviews (
  id SERIAL PRIMARY KEY,
  service_id INTEGER NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title VARCHAR(255),
  content TEXT NOT NULL,
  status ENUM('approved', 'pending', 'rejected') DEFAULT 'pending',
  helpful_count INTEGER DEFAULT 0,
  created_by_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(service_id, user_id)
);
```

#### `review_images` 테이블
```sql
-- 리뷰 이미지
CREATE TABLE review_images (
  id SERIAL PRIMARY KEY,
  review_id INTEGER NOT NULL REFERENCES reviews(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

### 1.5 시스템 관련 테이블

#### `banners` 테이블
```sql
-- 메인 페이지 배너
CREATE TABLE banners (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255),
  image_url TEXT NOT NULL,
  link_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### `notices` 테이블
```sql
-- 공지사항
CREATE TABLE notices (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  tags TEXT, -- JSON array or comma-separated
  is_pinned BOOLEAN DEFAULT FALSE,
  view_count INTEGER DEFAULT 0,
  created_by INTEGER NOT NULL REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### `settings` 테이블
```sql
-- 시스템 설정
CREATE TABLE settings (
  id SERIAL PRIMARY KEY,
  key VARCHAR(100) NOT NULL UNIQUE,
  value TEXT NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### `terms` 테이블
```sql
-- 약관
CREATE TABLE terms (
  id SERIAL PRIMARY KEY,
  slug VARCHAR(100) NOT NULL UNIQUE,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 2. API 엔드포인트

### 2.1 인증 API (`/auth`)

| 메서드 | 엔드포인트 | 설명 | 인증 |
|--------|----------|------|------|
| POST | `/auth/login` | 로그인 | N |
| POST | `/auth/register` | 회원가입 | N |
| POST | `/auth/logout` | 로그아웃 | Y |
| POST | `/auth/refresh-token` | 토큰 갱신 | Y |
| POST | `/auth/check-email` | 이메일 중복 확인 | N |
| POST | `/auth/find-email` | 이메일 찾기 | N |
| POST | `/auth/send-reset-code` | 비밀번호 재설정 코드 발송 | N |
| POST | `/auth/verify-reset-code` | 코드 검증 | N |
| POST | `/auth/reset-password` | 비밀번호 재설정 | N |
| POST | `/auth/oauth/callback` | 소셜 로그인 콜백 | N |

**요청/응답 예시:**

```typescript
// POST /auth/login
Request: {
  email: string;
  password: string;
  remember_me?: boolean;
}

Response: {
  access_token: string;
  refresh_token: string;
  user: {
    id: number;
    email: string;
    name: string;
  };
}
```

---

### 2.2 사용자 API (`/user`)

| 메서드 | 엔드포인트 | 설명 | 인증 |
|--------|----------|------|------|
| GET | `/user/profile` | 프로필 조회 | Y |
| PUT | `/user/profile` | 프로필 수정 | Y |
| GET | `/user/account-info` | 환불 계좌 조회 | Y |
| PUT | `/user/account-info` | 환불 계좌 수정 | Y |
| GET | `/user/orders` | 주문 목록 | Y |
| GET | `/user/orders/:id` | 주문 상세 조회 | Y |
| POST | `/user/orders/:id/cancel` | 주문 취소 | Y |
| POST | `/user/orders/:id/refund` | 환불 요청 | Y |

---

### 2.3 서비스 API (`/services`)

| 메서드 | 엔드포인트 | 설명 | 인증 |
|--------|----------|------|------|
| GET | `/services` | 서비스 목록 | N |
| GET | `/services/:id` | 서비스 상세 조회 | N |
| GET | `/services/:id/reviews` | 리뷰 목록 | N |
| POST | `/services/:id/reviews` | 리뷰 작성 | Y |
| PUT | `/services/:id/reviews/:reviewId` | 리뷰 수정 | Y |
| DELETE | `/services/:id/reviews/:reviewId` | 리뷰 삭제 | Y |
| GET | `/services/:id/reviews/stats` | 리뷰 통계 | N |

**쿼리 파라미터 예시:**

```typescript
// GET /services?search=...&category=...&minPrice=...&maxPrice=...&sort=...&page=...&limit=...
{
  search?: string;           // 검색어
  category?: number;         // 카테고리 ID
  minPrice?: number;         // 최소 가격
  maxPrice?: number;         // 최대 가격
  rating?: number;           // 최소 평점
  sort?: 'latest' | 'popular' | 'price_asc' | 'price_desc' | 'rating';
  page?: number;             // 페이지 (기본값: 1)
  limit?: number;            // 페이지당 항목 수 (기본값: 20)
}
```

---

### 2.4 주문 API (`/orders`)

| 메서드 | 엔드포인트 | 설명 | 인증 |
|--------|----------|------|------|
| POST | `/orders` | 주문 생성 | Y |
| GET | `/orders/preview` | 주문 미리보기 | Y |

**요청 예시:**

```typescript
// POST /orders
Request: {
  service_id: number;
  plan_id: number;
  scheduled_date?: string; // ISO 8601 형식
}

Response: {
  order: {
    id: number;
    order_number: string;
    total_amount: number;
    status: string;
    service: { ... };
    plan: { ... };
  };
}
```

---

### 2.5 공개 API

| 메서드 | 엔드포인트 | 설명 |
|--------|----------|------|
| GET | `/banners` | 배너 목록 |
| GET | `/notices` | 공지사항 목록 |
| GET | `/terms/:id` | 약관 조회 |
| POST | `/upload` | 이미지 업로드 |

---

### 2.6 관리자 API (`/admin`)

#### 대시보드
| 메서드 | 엔드포인트 | 설명 |
|--------|----------|------|
| GET | `/admin/dashboard/stats` | 대시보드 통계 |
| GET | `/admin/dashboard/recent-activity` | 최근 활동 |
| GET | `/admin/dashboard/sales-chart` | 매출 차트 데이터 |

#### 회원 관리
| 메서드 | 엔드포인트 | 설명 |
|--------|----------|------|
| GET | `/admin/users` | 회원 목록 |
| GET | `/admin/users/:id` | 회원 상세 조회 |
| PUT | `/admin/users/:id` | 회원 정보 수정 |
| PUT | `/admin/users/:id/status` | 회원 상태 변경 |
| POST | `/admin/users/:id/memo` | 회원 메모 추가 |

#### 서비스 관리
| 메서드 | 엔드포인트 | 설명 |
|--------|----------|------|
| GET | `/admin/services` | 서비스 목록 |
| POST | `/admin/services` | 서비스 생성 |
| GET | `/admin/services/:id` | 서비스 상세 조회 |
| PUT | `/admin/services/:id` | 서비스 수정 |
| DELETE | `/admin/services/:id` | 서비스 삭제 |
| POST | `/admin/services/:id/images` | 이미지 업로드 |
| DELETE | `/admin/services/:id/images/:imageId` | 이미지 삭제 |

#### 주문 관리
| 메서드 | 엔드포인트 | 설명 |
|--------|----------|------|
| GET | `/admin/orders` | 주문 목록 |
| GET | `/admin/orders/:id` | 주문 상세 조회 |
| PUT | `/admin/orders/:id/status` | 주문 상태 변경 |
| PUT | `/admin/orders/:id/payment-status` | 결제 상태 변경 |
| POST | `/admin/orders/:id/confirm-payment` | 입금 확인 |
| POST | `/admin/orders/:id/refund` | 환불 처리 |

#### 리뷰 관리
| 메서드 | 엔드포인트 | 설명 |
|--------|----------|------|
| GET | `/admin/reviews` | 리뷰 목록 |
| POST | `/admin/reviews` | 관리자 리뷰 작성 |
| PUT | `/admin/reviews/:id` | 리뷰 수정 |
| DELETE | `/admin/reviews/:id` | 리뷰 삭제 |
| PUT | `/admin/reviews/:id/status` | 리뷰 상태 변경 |
| POST | `/admin/reviews/:id/images` | 리뷰 이미지 업로드 |

#### 배너 관리
| 메서드 | 엔드포인트 | 설명 |
|--------|----------|------|
| GET | `/admin/banners` | 배너 목록 |
| POST | `/admin/banners` | 배너 추가 |
| PUT | `/admin/banners/:id` | 배너 수정 |
| DELETE | `/admin/banners/:id` | 배너 삭제 |
| POST | `/admin/banners/:id/images` | 배너 이미지 업로드 |

#### 공지사항 관리
| 메서드 | 엔드포인트 | 설명 |
|--------|----------|------|
| GET | `/admin/notices` | 공지사항 목록 |
| POST | `/admin/notices` | 공지사항 생성 |
| GET | `/admin/notices/:id` | 공지사항 상세 조회 |
| PUT | `/admin/notices/:id` | 공지사항 수정 |
| DELETE | `/admin/notices/:id` | 공지사항 삭제 |
| PUT | `/admin/notices/:id/pin` | 공지사항 고정/해제 |

#### 설정
| 메서드 | 엔드포인트 | 설명 |
|--------|----------|------|
| GET | `/admin/settings` | 설정 조회 |
| PUT | `/admin/settings` | 설정 저장 |
| GET | `/admin/settings/terms/:id` | 약관 조회 |
| PUT | `/admin/settings/terms/:id` | 약관 수정 |

---

## 3. 응답 형식

### 성공 응답
```typescript
{
  success: true;
  data: any;
  message?: string;
}
```

### 에러 응답
```typescript
{
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
  };
}
```

### 페이지네이션 응답
```typescript
{
  success: true;
  data: {
    items: any[];
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}
```

---

## 4. 인증 및 권한

### 토큰 기반 인증
- JWT (JSON Web Token) 사용
- Access Token (15분 유효)
- Refresh Token (7일 유효)
- HTTP-Only 쿠키에 저장

### 권한 검증
- 사용자 (user) vs 관리자 (admin)
- 자신의 데이터만 접근 가능
- 관리자는 모든 데이터 접근 가능

---

## 5. 데이터베이스 마이그레이션

Drizzle ORM 스키마 파일 위치:
```
apps/api/src/db/schema/index.ts
```

마이그레이션 명령어:
```bash
cd apps/api
npx drizzle-kit generate   # 스키마 변경 감지
npx drizzle-kit push       # DB에 적용
npx drizzle-kit studio     # UI에서 데이터 관리
```

---

## 6. 주요 고려사항

### 보안
- [ ] SQL Injection 방지 (ORM 사용)
- [ ] CSRF 토큰 검증
- [ ] CORS 설정
- [ ] Rate Limiting
- [ ] 입력 검증 및 살균

### 성능
- [ ] 데이터베이스 인덱싱
- [ ] 캐싱 (Redis)
- [ ] API 응답 최적화
- [ ] 쿼리 성능 모니터링

### 로깅
- [ ] API 요청/응답 로깅
- [ ] 에러 로깅
- [ ] 사용자 활동 로깅 (감시)

---

## 7. 향후 확장

- 결제 API 연동 (Toss, Stripe 등)
- 이메일 발송 서비스
- SMS 인증
- 캐시 서버 (Redis)
- 모니터링 및 분석
