# API 명세서 v2

> 실제 구현에 바로 사용 가능한 API 스펙

---

## 🔐 인증 (Authentication)

### 회원가입
```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123!",
  "name": "홍길동"
}
```

**성공 응답 (201 Created)**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "email": "user@example.com",
    "name": "홍길동"
  }
}
```

**실패 응답**
```json
// 400 Bad Request - 유효성 검사 실패
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "입력값이 올바르지 않습니다",
    "details": {
      "password": "비밀번호는 최소 8자 이상이어야 합니다"
    }
  }
}

// 409 Conflict - 이메일 중복
{
  "success": false,
  "error": {
    "code": "DUPLICATE_EMAIL",
    "message": "이미 등록된 이메일입니다"
  }
}
```

---

### 로그인
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123!"
}
```

**성공 응답 (200 OK)**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "email": "user@example.com",
      "name": "홍길동",
      "role": "user"
    }
  }
}
```

**실패 응답**
```json
// 401 Unauthorized
{
  "success": false,
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "이메일 또는 비밀번호가 올바르지 않습니다"
  }
}
```

---

### 토큰 갱신
```http
POST /auth/refresh
Content-Type: application/json

{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**성공 응답 (200 OK)**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### 로그아웃
```http
POST /auth/logout
Authorization: Bearer {accessToken}
```

**성공 응답 (200 OK)**
```json
{
  "success": true,
  "message": "로그아웃되었습니다"
}
```

---

## 👤 사용자 (User)

### 내 정보 조회
```http
GET /user/profile
Authorization: Bearer {accessToken}
```

**성공 응답 (200 OK)**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "email": "user@example.com",
    "name": "홍길동",
    "phone": "010-1234-5678",
    "createdAt": "2024-01-01T00:00:00Z",
    "account": {
      "bankName": "국민은행",
      "accountNumber": "123-456-789012",
      "accountHolder": "홍길동"
    }
  }
}
```

---

### 내 정보 수정
```http
PUT /user/profile
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "name": "홍길동",
  "phone": "010-1234-5678"
}
```

**성공 응답 (200 OK)**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "email": "user@example.com",
    "name": "홍길동",
    "phone": "010-1234-5678"
  }
}
```

---

### 내 주문 목록
```http
GET /user/orders?page=1&limit=10&status=pending
Authorization: Bearer {accessToken}
```

**Query Parameters**
| 파라미터 | 타입 | 필수 | 기본값 | 설명 |
|---------|------|------|-------|------|
| page | number | X | 1 | 페이지 번호 |
| limit | number | X | 10 | 페이지당 항목 수 |
| status | string | X | all | pending, processing, completed, cancelled |

**성공 응답 (200 OK)**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": 1,
        "orderNumber": "20240101-A1B2C3",
        "service": {
          "id": 1,
          "title": "웹 개발 강의",
          "imageUrl": "https://..."
        },
        "totalAmount": "99000",
        "status": "pending",
        "createdAt": "2024-01-01T00:00:00Z"
      }
    ],
    "pagination": {
      "total": 25,
      "page": 1,
      "limit": 10,
      "pages": 3
    }
  }
}
```

---

## 📦 서비스 (Services)

### 서비스 목록
```http
GET /services?page=1&limit=20&search=개발&categoryId=1&minPrice=10000&maxPrice=100000&sort=latest
```

**Query Parameters**
| 파라미터 | 타입 | 필수 | 기본값 | 설명 |
|---------|------|------|-------|------|
| page | number | X | 1 | 페이지 번호 |
| limit | number | X | 20 | 페이지당 항목 수 (최대 100) |
| search | string | X | - | 검색어 (제목, 설명) |
| categoryId | number | X | - | 카테고리 ID |
| minPrice | number | X | - | 최소 가격 |
| maxPrice | number | X | - | 최대 가격 |
| sort | string | X | latest | latest, popular, price_asc, price_desc, rating |

**성공 응답 (200 OK)**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": 1,
        "title": "React 완벽 가이드",
        "description": "React를 처음부터 끝까지 마스터하는 강의",
        "price": "99000",
        "imageUrl": "https://example.com/image.jpg",
        "category": {
          "id": 1,
          "name": "개발",
          "slug": "development"
        },
        "averageRating": 4.5,
        "reviewCount": 42,
        "instructor": {
          "id": 1,
          "name": "김강사"
        },
        "createdAt": "2024-01-01T00:00:00Z"
      }
    ],
    "pagination": {
      "total": 150,
      "page": 1,
      "limit": 20,
      "pages": 8
    },
    "filters": {
      "categories": [
        { "id": 1, "name": "개발", "count": 50 },
        { "id": 2, "name": "디자인", "count": 30 }
      ],
      "priceRange": {
        "min": 0,
        "max": 500000
      }
    }
  }
}
```

---

### 서비스 상세
```http
GET /services/1
```

**성공 응답 (200 OK)**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "React 완벽 가이드",
    "description": "React를 처음부터 끝까지 마스터하는 강의입니다...",
    "longDescription": "# 강의 소개\n\n이 강의는...",
    "price": "99000",
    "discountPrice": "79000",
    "discountRate": 20,
    "images": [
      "https://example.com/image1.jpg",
      "https://example.com/image2.jpg"
    ],
    "category": {
      "id": 1,
      "name": "개발",
      "slug": "development"
    },
    "plans": [
      {
        "id": 1,
        "name": "Basic",
        "price": "99000",
        "duration": 30,
        "features": ["기본 강의", "Q&A 게시판"]
      },
      {
        "id": 2,
        "name": "Premium",
        "price": "149000",
        "duration": 90,
        "features": ["기본 강의", "Q&A 게시판", "1:1 멘토링", "수료증"]
      }
    ],
    "instructor": {
      "id": 1,
      "name": "김강사",
      "bio": "10년차 시니어 개발자",
      "profileImage": "https://..."
    },
    "curriculum": [
      {
        "section": "1. React 기초",
        "lectures": [
          { "title": "React란 무엇인가", "duration": 15 },
          { "title": "JSX 이해하기", "duration": 20 }
        ]
      }
    ],
    "requirements": ["HTML/CSS 기초 지식", "JavaScript ES6"],
    "targetAudience": ["React를 처음 배우는 개발자", "주니어 프론트엔드 개발자"],
    "averageRating": 4.5,
    "reviewCount": 42,
    "ratings": {
      "5": 25,
      "4": 10,
      "3": 5,
      "2": 1,
      "1": 1
    },
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-15T00:00:00Z"
  }
}
```

**실패 응답**
```json
// 404 Not Found
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "서비스를 찾을 수 없습니다"
  }
}
```

---

### 카테고리 목록
```http
GET /services/categories
```

**성공 응답 (200 OK)**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "개발",
      "slug": "development",
      "serviceCount": 50
    },
    {
      "id": 2,
      "name": "디자인",
      "slug": "design",
      "serviceCount": 30
    }
  ]
}
```

---

## 🛒 주문 (Orders)

### 주문 생성
```http
POST /orders
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "serviceId": 1,
  "planId": 2,
  "scheduledDate": "2024-02-01T00:00:00Z"
}
```

**성공 응답 (201 Created)**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "orderNumber": "20240101-A1B2C3",
    "service": {
      "id": 1,
      "title": "React 완벽 가이드",
      "imageUrl": "https://..."
    },
    "plan": {
      "id": 2,
      "name": "Premium",
      "price": "149000"
    },
    "totalAmount": "149000",
    "status": "pending",
    "paymentDueDate": "2024-01-03T23:59:59Z",
    "bankAccount": {
      "bankName": "국민은행",
      "accountNumber": "123-456-789012",
      "accountHolder": "트렌디"
    },
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

**실패 응답**
```json
// 404 Not Found
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "서비스를 찾을 수 없습니다"
  }
}

// 400 Bad Request - 이미 구매한 서비스
{
  "success": false,
  "error": {
    "code": "ALREADY_PURCHASED",
    "message": "이미 구매한 서비스입니다"
  }
}
```

---

### 주문 취소
```http
POST /orders/1/cancel
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "reason": "단순 변심"
}
```

**성공 응답 (200 OK)**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "orderNumber": "20240101-A1B2C3",
    "status": "cancelled",
    "cancelledAt": "2024-01-02T00:00:00Z",
    "cancelReason": "단순 변심"
  }
}
```

**실패 응답**
```json
// 400 Bad Request - 취소 불가 상태
{
  "success": false,
  "error": {
    "code": "CANNOT_CANCEL",
    "message": "이미 처리된 주문은 취소할 수 없습니다"
  }
}
```

---

## 💬 리뷰 (Reviews)

### 리뷰 목록
```http
GET /services/1/reviews?page=1&limit=10&sort=latest&rating=5
```

**Query Parameters**
| 파라미터 | 타입 | 필수 | 기본값 | 설명 |
|---------|------|------|-------|------|
| page | number | X | 1 | 페이지 번호 |
| limit | number | X | 10 | 페이지당 항목 수 |
| sort | string | X | latest | latest, helpful, rating_high, rating_low |
| rating | number | X | - | 특정 평점만 필터 (1-5) |

**성공 응답 (200 OK)**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": 1,
        "rating": 5,
        "title": "정말 좋은 강의입니다",
        "content": "React를 제대로 배울 수 있었어요...",
        "images": [
          "https://example.com/review1.jpg"
        ],
        "user": {
          "id": 1,
          "name": "김*호",
          "profileImage": null
        },
        "helpfulCount": 15,
        "isHelpful": false,
        "isPurchaseVerified": true,
        "createdAt": "2024-01-15T00:00:00Z",
        "reply": {
          "content": "감사합니다!",
          "createdAt": "2024-01-16T00:00:00Z"
        }
      }
    ],
    "pagination": {
      "total": 42,
      "page": 1,
      "limit": 10,
      "pages": 5
    },
    "summary": {
      "averageRating": 4.5,
      "totalCount": 42,
      "ratings": {
        "5": 25,
        "4": 10,
        "3": 5,
        "2": 1,
        "1": 1
      }
    }
  }
}
```

---

### 리뷰 작성
```http
POST /services/1/reviews
Authorization: Bearer {accessToken}
Content-Type: multipart/form-data

{
  "rating": 5,
  "title": "정말 좋은 강의입니다",
  "content": "React를 제대로 배울 수 있었어요...",
  "images": [File, File]
}
```

**성공 응답 (201 Created)**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "rating": 5,
    "title": "정말 좋은 강의입니다",
    "content": "React를 제대로 배울 수 있었어요...",
    "images": [
      "https://example.com/review1.jpg",
      "https://example.com/review2.jpg"
    ],
    "createdAt": "2024-01-15T00:00:00Z"
  }
}
```

**실패 응답**
```json
// 400 Bad Request - 구매하지 않은 서비스
{
  "success": false,
  "error": {
    "code": "NOT_PURCHASED",
    "message": "구매한 서비스만 리뷰를 작성할 수 있습니다"
  }
}

// 409 Conflict - 이미 작성한 리뷰
{
  "success": false,
  "error": {
    "code": "REVIEW_EXISTS",
    "message": "이미 리뷰를 작성하셨습니다"
  }
}
```

---

## 🛠️ 관리자 (Admin)

### 대시보드 통계
```http
GET /admin/dashboard/stats
Authorization: Bearer {accessToken}
```

**성공 응답 (200 OK)**
```json
{
  "success": true,
  "data": {
    "overview": {
      "totalRevenue": "15000000",
      "totalOrders": 150,
      "totalUsers": 1200,
      "totalServices": 45
    },
    "revenueChart": {
      "labels": ["1월", "2월", "3월"],
      "datasets": [
        {
          "label": "매출",
          "data": [5000000, 4500000, 5500000]
        }
      ]
    },
    "recentOrders": [
      {
        "id": 1,
        "orderNumber": "20240101-A1B2C3",
        "userName": "홍길동",
        "serviceTitle": "React 완벽 가이드",
        "totalAmount": "99000",
        "status": "pending",
        "createdAt": "2024-01-01T00:00:00Z"
      }
    ],
    "topServices": [
      {
        "id": 1,
        "title": "React 완벽 가이드",
        "orderCount": 42,
        "revenue": "4158000"
      }
    ]
  }
}
```

**실패 응답**
```json
// 403 Forbidden - 관리자 권한 필요
{
  "success": false,
  "error": {
    "code": "FORBIDDEN",
    "message": "관리자 권한이 필요합니다"
  }
}
```

---

### 회원 관리
```http
GET /admin/users?page=1&limit=20&search=홍길동&status=active
Authorization: Bearer {accessToken}
```

**Query Parameters**
| 파라미터 | 타입 | 필수 | 기본값 | 설명 |
|---------|------|------|-------|------|
| page | number | X | 1 | 페이지 번호 |
| limit | number | X | 20 | 페이지당 항목 수 |
| search | string | X | - | 이름, 이메일 검색 |
| status | string | X | all | active, inactive, suspended |
| startDate | string | X | - | 가입일 시작 (ISO 8601) |
| endDate | string | X | - | 가입일 종료 (ISO 8601) |

**성공 응답 (200 OK)**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": 1,
        "email": "user@example.com",
        "name": "홍길동",
        "phone": "010-1234-5678",
        "status": "active",
        "role": "user",
        "orderCount": 5,
        "totalSpent": "495000",
        "lastLoginAt": "2024-01-20T00:00:00Z",
        "createdAt": "2024-01-01T00:00:00Z",
        "memo": "VIP 고객"
      }
    ],
    "pagination": {
      "total": 1200,
      "page": 1,
      "limit": 20,
      "pages": 60
    }
  }
}
```

---

### 서비스 관리 - 생성
```http
POST /admin/services
Authorization: Bearer {accessToken}
Content-Type: multipart/form-data

{
  "title": "Node.js 백엔드 마스터",
  "description": "Node.js로 백엔드 개발하기",
  "longDescription": "# 강의 소개\n\n...",
  "categoryId": 1,
  "price": "129000",
  "images": [File, File],
  "plans": [
    {
      "name": "Basic",
      "price": "129000",
      "duration": 30,
      "features": ["기본 강의"]
    }
  ],
  "curriculum": [
    {
      "section": "1. Node.js 기초",
      "lectures": [
        { "title": "Node.js란?", "duration": 15 }
      ]
    }
  ],
  "requirements": ["JavaScript 기초"],
  "targetAudience": ["백엔드 개발 입문자"],
  "status": "draft"
}
```

**성공 응답 (201 Created)**
```json
{
  "success": true,
  "data": {
    "id": 2,
    "title": "Node.js 백엔드 마스터",
    "slug": "nodejs-backend-master",
    "status": "draft",
    "createdAt": "2024-01-20T00:00:00Z"
  }
}
```

---

### 주문 관리 - 상태 변경
```http
PATCH /admin/orders/1/status
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "status": "processing",
  "note": "입금 확인됨"
}
```

**성공 응답 (200 OK)**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "orderNumber": "20240101-A1B2C3",
    "status": "processing",
    "statusHistory": [
      {
        "status": "pending",
        "createdAt": "2024-01-01T00:00:00Z"
      },
      {
        "status": "processing",
        "note": "입금 확인됨",
        "createdBy": "관리자",
        "createdAt": "2024-01-02T00:00:00Z"
      }
    ]
  }
}
```

---

## 🔧 공통 사항

### 페이지네이션 응답 구조
```typescript
interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    total: number;    // 전체 항목 수
    page: number;     // 현재 페이지
    limit: number;    // 페이지당 항목 수
    pages: number;    // 전체 페이지 수
  };
}
```

### 에러 응답 구조
```typescript
interface ErrorResponse {
  success: false;
  error: {
    code: string;        // 에러 코드 (ENUM)
    message: string;     // 사용자 메시지
    details?: any;       // 추가 정보
    timestamp: string;   // ISO 8601
    path: string;        // 요청 경로
  };
}
```

### HTTP 헤더
```http
# 모든 요청
Content-Type: application/json
Accept: application/json

# 인증이 필요한 요청
Authorization: Bearer {accessToken}

# 파일 업로드
Content-Type: multipart/form-data

# CORS
Access-Control-Allow-Origin: *
Access-Control-Allow-Credentials: true
```

### Rate Limiting
```http
# 응답 헤더
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 99
X-RateLimit-Reset: 1640995200

# 제한 초과 시 (429 Too Many Requests)
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "요청 제한을 초과했습니다. 잠시 후 다시 시도해주세요",
    "retryAfter": 60
  }
}
```

### 버전 관리
```http
# URL 버전 방식
GET /v1/services
GET /v2/services

# 헤더 버전 방식
GET /services
API-Version: 2024-01-01
```