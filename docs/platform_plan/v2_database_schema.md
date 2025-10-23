# 데이터베이스 스키마 구현 가이드

> Drizzle ORM을 사용한 실제 구현 가능한 스키마

---

## 📁 파일 구조

```
apps/api/src/db/
├── schema/
│   ├── index.ts          # 모든 스키마 export
│   ├── users.schema.ts   # 사용자 관련 테이블
│   ├── services.schema.ts # 서비스 관련 테이블
│   ├── orders.schema.ts  # 주문 관련 테이블
│   └── reviews.schema.ts # 리뷰 관련 테이블
├── db.ts                  # 데이터베이스 연결
├── migrate.ts             # 마이그레이션 스크립트
└── seed.ts               # 초기 데이터 시딩
```

---

## 🗄️ 스키마 정의

### users.schema.ts
```typescript
import { pgTable, serial, varchar, timestamp, boolean, text, index, unique } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// 사용자 테이블
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  name: varchar('name', { length: 100 }).notNull(),
  phone: varchar('phone', { length: 20 }),
  profileImageUrl: text('profile_image_url'),
  role: varchar('role', { length: 20 }).default('user').notNull(), // 'user' | 'admin'
  status: varchar('status', { length: 20 }).default('active').notNull(), // 'active' | 'inactive' | 'suspended'
  emailVerified: boolean('email_verified').default(false).notNull(),
  lastLoginAt: timestamp('last_login_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  emailIdx: index('idx_users_email').on(table.email),
  statusIdx: index('idx_users_status').on(table.status),
  roleIdx: index('idx_users_role').on(table.role),
}));

// 사용자 관계
export const usersRelations = relations(users, ({ many, one }) => ({
  orders: many(orders),
  reviews: many(reviews),
  account: one(userAccounts),
  oauthAccounts: many(oauthAccounts),
}));

// 환불 계좌 정보
export const userAccounts = pgTable('user_accounts', {
  id: serial('id').primaryKey(),
  userId: serial('user_id').notNull().unique().references(() => users.id, { onDelete: 'cascade' }),
  bankName: varchar('bank_name', { length: 50 }),
  accountNumber: varchar('account_number', { length: 50 }),
  accountHolder: varchar('account_holder', { length: 100 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  userIdx: index('idx_user_accounts_user').on(table.userId),
}));

// OAuth 계정 연결
export const oauthAccounts = pgTable('oauth_accounts', {
  id: serial('id').primaryKey(),
  userId: serial('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  provider: varchar('provider', { length: 20 }).notNull(), // 'kakao' | 'naver' | 'google'
  providerId: varchar('provider_id', { length: 255 }).notNull(),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  expiresAt: timestamp('expires_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  userIdx: index('idx_oauth_accounts_user').on(table.userId),
  providerIdx: unique('uniq_oauth_provider').on(table.provider, table.providerId),
}));

// 타입 정의
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type UserAccount = typeof userAccounts.$inferSelect;
export type NewUserAccount = typeof userAccounts.$inferInsert;
```

---

### services.schema.ts
```typescript
import { pgTable, serial, varchar, text, decimal, integer, timestamp, boolean, jsonb, index } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { users } from './users.schema';

// 카테고리
export const categories = pgTable('categories', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull().unique(),
  slug: varchar('slug', { length: 100 }).notNull().unique(),
  description: text('description'),
  orderIndex: integer('order_index').default(0).notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  slugIdx: index('idx_categories_slug').on(table.slug),
  activeIdx: index('idx_categories_active').on(table.isActive),
}));

// 서비스
export const services = pgTable('services', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  description: text('description').notNull(),
  longDescription: text('long_description'),
  categoryId: integer('category_id').references(() => categories.id),
  instructorId: integer('instructor_id').references(() => users.id),

  // 가격 정보
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  discountPrice: decimal('discount_price', { precision: 10, scale: 2 }),
  discountRate: integer('discount_rate'), // 할인율 %

  // 이미지
  thumbnailUrl: text('thumbnail_url'),
  bannerImageUrl: text('banner_image_url'),

  // 커리큘럼 및 요구사항 (JSON)
  curriculum: jsonb('curriculum'), // [{section: string, lectures: [{title, duration}]}]
  requirements: jsonb('requirements'), // string[]
  targetAudience: jsonb('target_audience'), // string[]

  // 통계
  averageRating: decimal('average_rating', { precision: 3, scale: 2 }).default('0').notNull(),
  reviewCount: integer('review_count').default(0).notNull(),
  enrollmentCount: integer('enrollment_count').default(0).notNull(),

  // 상태
  status: varchar('status', { length: 20 }).default('draft').notNull(), // 'draft' | 'published' | 'archived'
  publishedAt: timestamp('published_at'),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  slugIdx: index('idx_services_slug').on(table.slug),
  categoryIdx: index('idx_services_category').on(table.categoryId),
  instructorIdx: index('idx_services_instructor').on(table.instructorId),
  statusIdx: index('idx_services_status').on(table.status),
  priceIdx: index('idx_services_price').on(table.price),
  ratingIdx: index('idx_services_rating').on(table.averageRating),
}));

// 서비스 관계
export const servicesRelations = relations(services, ({ one, many }) => ({
  category: one(categories, {
    fields: [services.categoryId],
    references: [categories.id],
  }),
  instructor: one(users, {
    fields: [services.instructorId],
    references: [users.id],
  }),
  plans: many(servicePlans),
  images: many(serviceImages),
  reviews: many(reviews),
  orders: many(orders),
}));

// 서비스 플랜
export const servicePlans = pgTable('service_plans', {
  id: serial('id').primaryKey(),
  serviceId: integer('service_id').notNull().references(() => services.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 100 }).notNull(),
  description: text('description'),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  duration: integer('duration'), // 일 단위
  features: jsonb('features'), // string[]
  maxEnrollments: integer('max_enrollments'), // 최대 수강 인원
  orderIndex: integer('order_index').default(0).notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  serviceIdx: index('idx_service_plans_service').on(table.serviceId),
  activeIdx: index('idx_service_plans_active').on(table.isActive),
}));

// 서비스 이미지
export const serviceImages = pgTable('service_images', {
  id: serial('id').primaryKey(),
  serviceId: integer('service_id').notNull().references(() => services.id, { onDelete: 'cascade' }),
  imageUrl: text('image_url').notNull(),
  altText: varchar('alt_text', { length: 255 }),
  orderIndex: integer('order_index').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  serviceIdx: index('idx_service_images_service').on(table.serviceId),
}));

// 타입 정의
export type Category = typeof categories.$inferSelect;
export type NewCategory = typeof categories.$inferInsert;
export type Service = typeof services.$inferSelect;
export type NewService = typeof services.$inferInsert;
export type ServicePlan = typeof servicePlans.$inferSelect;
export type NewServicePlan = typeof servicePlans.$inferInsert;
```

---

### orders.schema.ts
```typescript
import { pgTable, serial, varchar, decimal, integer, timestamp, jsonb, index } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { users } from './users.schema';
import { services, servicePlans } from './services.schema';

// 주문
export const orders = pgTable('orders', {
  id: serial('id').primaryKey(),
  orderNumber: varchar('order_number', { length: 50 }).notNull().unique(),

  // 관계
  userId: integer('user_id').notNull().references(() => users.id),
  serviceId: integer('service_id').notNull().references(() => services.id),
  planId: integer('plan_id').references(() => servicePlans.id),

  // 금액
  servicePrice: decimal('service_price', { precision: 10, scale: 2 }).notNull(),
  discountAmount: decimal('discount_amount', { precision: 10, scale: 2 }).default('0').notNull(),
  totalAmount: decimal('total_amount', { precision: 10, scale: 2 }).notNull(),

  // 상태
  status: varchar('status', { length: 20 }).default('pending').notNull(),
  // 'pending' | 'paid' | 'processing' | 'completed' | 'cancelled' | 'refunded'
  paymentStatus: varchar('payment_status', { length: 20 }).default('unpaid').notNull(),
  // 'unpaid' | 'paid' | 'refunded' | 'partial_refunded'

  // 결제 정보
  paymentMethod: varchar('payment_method', { length: 50 }), // 'bank_transfer' | 'card' | 'kakao_pay'
  paymentDueDate: timestamp('payment_due_date'),
  paidAt: timestamp('paid_at'),

  // 일정
  scheduledDate: timestamp('scheduled_date'),
  completedAt: timestamp('completed_at'),

  // 취소/환불
  cancelledAt: timestamp('cancelled_at'),
  cancelReason: text('cancel_reason'),
  refundedAt: timestamp('refunded_at'),
  refundAmount: decimal('refund_amount', { precision: 10, scale: 2 }),
  refundReason: text('refund_reason'),

  // 메모
  userNote: text('user_note'),
  adminNote: text('admin_note'),

  // 메타 데이터
  metadata: jsonb('metadata'), // 추가 정보 저장용

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  orderNumberIdx: index('idx_orders_number').on(table.orderNumber),
  userIdx: index('idx_orders_user').on(table.userId),
  serviceIdx: index('idx_orders_service').on(table.serviceId),
  statusIdx: index('idx_orders_status').on(table.status),
  paymentStatusIdx: index('idx_orders_payment_status').on(table.paymentStatus),
  createdAtIdx: index('idx_orders_created').on(table.createdAt),
}));

// 주문 관계
export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
  }),
  service: one(services, {
    fields: [orders.serviceId],
    references: [services.id],
  }),
  plan: one(servicePlans, {
    fields: [orders.planId],
    references: [servicePlans.id],
  }),
  statusHistory: many(orderStatusHistory),
}));

// 주문 상태 이력
export const orderStatusHistory = pgTable('order_status_history', {
  id: serial('id').primaryKey(),
  orderId: integer('order_id').notNull().references(() => orders.id, { onDelete: 'cascade' }),
  previousStatus: varchar('previous_status', { length: 20 }),
  newStatus: varchar('new_status', { length: 20 }).notNull(),
  note: text('note'),
  createdBy: integer('created_by').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  orderIdx: index('idx_order_status_history_order').on(table.orderId),
}));

// 타입 정의
export type Order = typeof orders.$inferSelect;
export type NewOrder = typeof orders.$inferInsert;
export type OrderStatusHistory = typeof orderStatusHistory.$inferSelect;
export type NewOrderStatusHistory = typeof orderStatusHistory.$inferInsert;
```

---

### reviews.schema.ts
```typescript
import { pgTable, serial, integer, text, timestamp, boolean, index, unique, check } from 'drizzle-orm/pg-core';
import { relations, sql } from 'drizzle-orm';
import { users } from './users.schema';
import { services } from './services.schema';
import { orders } from './orders.schema';

// 리뷰
export const reviews = pgTable('reviews', {
  id: serial('id').primaryKey(),
  serviceId: integer('service_id').notNull().references(() => services.id, { onDelete: 'cascade' }),
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  orderId: integer('order_id').references(() => orders.id),

  rating: integer('rating').notNull(),
  title: varchar('title', { length: 255 }),
  content: text('content').notNull(),

  // 통계
  helpfulCount: integer('helpful_count').default(0).notNull(),

  // 상태
  status: varchar('status', { length: 20 }).default('pending').notNull(),
  // 'pending' | 'approved' | 'rejected' | 'hidden'
  isPurchaseVerified: boolean('is_purchase_verified').default(false).notNull(),
  createdByAdmin: boolean('created_by_admin').default(false).notNull(),

  // 관리자 답글
  replyContent: text('reply_content'),
  repliedAt: timestamp('replied_at'),
  repliedBy: integer('replied_by').references(() => users.id),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  serviceIdx: index('idx_reviews_service').on(table.serviceId),
  userIdx: index('idx_reviews_user').on(table.userId),
  orderIdx: index('idx_reviews_order').on(table.orderId),
  statusIdx: index('idx_reviews_status').on(table.status),
  ratingIdx: index('idx_reviews_rating').on(table.rating),
  uniqueUserService: unique('uniq_review_user_service').on(table.userId, table.serviceId),
  ratingCheck: check('rating_check', sql`${table.rating} >= 1 AND ${table.rating} <= 5`),
}));

// 리뷰 관계
export const reviewsRelations = relations(reviews, ({ one, many }) => ({
  service: one(services, {
    fields: [reviews.serviceId],
    references: [services.id],
  }),
  user: one(users, {
    fields: [reviews.userId],
    references: [users.id],
  }),
  order: one(orders, {
    fields: [reviews.orderId],
    references: [orders.id],
  }),
  images: many(reviewImages),
  helpfulVotes: many(reviewHelpfulVotes),
}));

// 리뷰 이미지
export const reviewImages = pgTable('review_images', {
  id: serial('id').primaryKey(),
  reviewId: integer('review_id').notNull().references(() => reviews.id, { onDelete: 'cascade' }),
  imageUrl: text('image_url').notNull(),
  altText: varchar('alt_text', { length: 255 }),
  orderIndex: integer('order_index').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  reviewIdx: index('idx_review_images_review').on(table.reviewId),
}));

// 리뷰 도움됨 투표
export const reviewHelpfulVotes = pgTable('review_helpful_votes', {
  id: serial('id').primaryKey(),
  reviewId: integer('review_id').notNull().references(() => reviews.id, { onDelete: 'cascade' }),
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  reviewIdx: index('idx_review_helpful_review').on(table.reviewId),
  userIdx: index('idx_review_helpful_user').on(table.userId),
  uniqueVote: unique('uniq_review_helpful_vote').on(table.reviewId, table.userId),
}));

// 타입 정의
export type Review = typeof reviews.$inferSelect;
export type NewReview = typeof reviews.$inferInsert;
export type ReviewImage = typeof reviewImages.$inferSelect;
export type NewReviewImage = typeof reviewImages.$inferInsert;
```

---

### system.schema.ts (추가 시스템 테이블)
```typescript
import { pgTable, serial, varchar, text, timestamp, boolean, integer, jsonb, index } from 'drizzle-orm/pg-core';

// 배너
export const banners = pgTable('banners', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }),
  imageUrl: text('image_url').notNull(),
  linkUrl: text('link_url'),
  target: varchar('target', { length: 20 }).default('_self'), // '_self' | '_blank'
  position: varchar('position', { length: 50 }).default('main'), // 'main' | 'side' | 'popup'
  isActive: boolean('is_active').default(true).notNull(),
  orderIndex: integer('order_index').default(0).notNull(),
  startDate: timestamp('start_date'),
  endDate: timestamp('end_date'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  positionIdx: index('idx_banners_position').on(table.position),
  activeIdx: index('idx_banners_active').on(table.isActive),
}));

// 공지사항
export const notices = pgTable('notices', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  content: text('content').notNull(),
  category: varchar('category', { length: 50 }).default('general'), // 'general' | 'event' | 'update'
  tags: jsonb('tags'), // string[]
  isPinned: boolean('is_pinned').default(false).notNull(),
  viewCount: integer('view_count').default(0).notNull(),
  createdBy: integer('created_by').notNull().references(() => users.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  categoryIdx: index('idx_notices_category').on(table.category),
  pinnedIdx: index('idx_notices_pinned').on(table.isPinned),
  createdAtIdx: index('idx_notices_created').on(table.createdAt),
}));

// 설정
export const settings = pgTable('settings', {
  id: serial('id').primaryKey(),
  key: varchar('key', { length: 100 }).notNull().unique(),
  value: text('value').notNull(),
  description: text('description'),
  dataType: varchar('data_type', { length: 20 }).default('string'), // 'string' | 'number' | 'boolean' | 'json'
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  keyIdx: index('idx_settings_key').on(table.key),
}));

// 약관
export const terms = pgTable('terms', {
  id: serial('id').primaryKey(),
  slug: varchar('slug', { length: 100 }).notNull().unique(),
  title: varchar('title', { length: 255 }).notNull(),
  content: text('content').notNull(),
  version: varchar('version', { length: 20 }).notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  slugIdx: index('idx_terms_slug').on(table.slug),
  activeIdx: index('idx_terms_active').on(table.isActive),
}));
```

---

## 🚀 마이그레이션 실행

### drizzle.config.ts
```typescript
import type { Config } from 'drizzle-kit';
import * as dotenv from 'dotenv';

dotenv.config();

export default {
  schema: './src/db/schema/index.ts',
  out: './drizzle',
  driver: 'pg',
  dbCredentials: {
    connectionString: process.env.DATABASE_URL!,
  },
  verbose: true,
  strict: true,
} satisfies Config;
```

### 마이그레이션 명령어
```bash
# 스키마 변경사항 생성
npx drizzle-kit generate:pg

# 마이그레이션 실행
npx drizzle-kit push:pg

# 마이그레이션 상태 확인
npx drizzle-kit status

# Drizzle Studio 실행 (GUI)
npx drizzle-kit studio
```

---

## 🌱 초기 데이터 시딩

### seed.ts
```typescript
import { db } from './db';
import { users, categories, services, servicePlans } from './schema';
import * as bcrypt from 'bcryptjs';

async function seed() {
  console.log('🌱 시딩 시작...');

  // 1. 관리자 계정 생성
  const adminPassword = await bcrypt.hash('admin123!', 10);
  const [admin] = await db.insert(users).values({
    email: 'admin@trendi.com',
    passwordHash: adminPassword,
    name: '관리자',
    role: 'admin',
    emailVerified: true,
  }).returning();

  console.log('✅ 관리자 계정 생성됨');

  // 2. 테스트 사용자 생성
  const userPassword = await bcrypt.hash('user123!', 10);
  const testUsers = await db.insert(users).values([
    {
      email: 'user1@example.com',
      passwordHash: userPassword,
      name: '김철수',
      phone: '010-1111-2222',
      role: 'user',
      emailVerified: true,
    },
    {
      email: 'user2@example.com',
      passwordHash: userPassword,
      name: '이영희',
      phone: '010-3333-4444',
      role: 'user',
      emailVerified: true,
    },
  ]).returning();

  console.log('✅ 테스트 사용자 2명 생성됨');

  // 3. 카테고리 생성
  const categoriesData = await db.insert(categories).values([
    { name: '개발', slug: 'development' },
    { name: '디자인', slug: 'design' },
    { name: '마케팅', slug: 'marketing' },
    { name: '비즈니스', slug: 'business' },
  ]).returning();

  console.log('✅ 카테고리 4개 생성됨');

  // 4. 서비스 생성
  const servicesData = [];
  for (let i = 1; i <= 20; i++) {
    servicesData.push({
      title: `서비스 ${i}`,
      slug: `service-${i}`,
      description: `이것은 서비스 ${i}의 설명입니다. 매우 유용한 서비스입니다.`,
      longDescription: `# 서비스 ${i} 상세 설명\n\n이 서비스는 정말 훌륭합니다...`,
      categoryId: categoriesData[i % 4].id,
      instructorId: admin.id,
      price: String(50000 + (i * 10000)),
      thumbnailUrl: `https://via.placeholder.com/300x200?text=Service${i}`,
      status: 'published',
      publishedAt: new Date(),
      curriculum: [
        {
          section: '섹션 1',
          lectures: [
            { title: '강의 1', duration: 15 },
            { title: '강의 2', duration: 20 },
          ],
        },
      ],
      requirements: ['기본 지식', '열정'],
      targetAudience: ['초보자', '중급자'],
    });
  }

  const createdServices = await db.insert(services).values(servicesData).returning();
  console.log('✅ 서비스 20개 생성됨');

  // 5. 서비스 플랜 생성
  for (const service of createdServices) {
    await db.insert(servicePlans).values([
      {
        serviceId: service.id,
        name: 'Basic',
        description: '기본 플랜',
        price: service.price,
        duration: 30,
        features: ['기본 강의', 'Q&A 게시판'],
        orderIndex: 1,
      },
      {
        serviceId: service.id,
        name: 'Premium',
        description: '프리미엄 플랜',
        price: String(Number(service.price) * 1.5),
        duration: 90,
        features: ['기본 강의', 'Q&A 게시판', '1:1 멘토링', '수료증'],
        orderIndex: 2,
      },
    ]);
  }

  console.log('✅ 서비스 플랜 생성됨');

  // 6. 설정 초기화
  await db.insert(settings).values([
    { key: 'site_name', value: 'DITREN', description: '사이트 이름' },
    { key: 'site_email', value: 'contact@trendi.com', description: '대표 이메일' },
    { key: 'bank_name', value: '국민은행', description: '입금 계좌 은행명' },
    { key: 'bank_account', value: '123-456-789012', description: '입금 계좌번호' },
    { key: 'bank_holder', value: '트렌디', description: '예금주명' },
  ]);

  console.log('✅ 기본 설정 생성됨');

  console.log('🎉 시딩 완료!');

  console.log('\n📝 테스트 계정:');
  console.log('관리자: admin@trendi.com / admin123!');
  console.log('사용자: user1@example.com / user123!');
}

seed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('❌ 시딩 실패:', err);
    process.exit(1);
  });
```

### 시딩 실행
```bash
# 시딩 스크립트 실행
cd apps/api
npx tsx src/db/seed.ts

# 또는 package.json 스크립트 추가
"scripts": {
  "db:seed": "tsx src/db/seed.ts",
  "db:migrate": "drizzle-kit push:pg",
  "db:studio": "drizzle-kit studio"
}
```

---

## 🔍 자주 사용하는 쿼리 예제

### 사용자 조회
```typescript
// 이메일로 사용자 찾기
const user = await db.select().from(users)
  .where(eq(users.email, 'user@example.com'))
  .limit(1);

// 사용자와 계좌 정보 함께 조회
const userWithAccount = await db.select({
  user: users,
  account: userAccounts,
})
.from(users)
.leftJoin(userAccounts, eq(users.id, userAccounts.userId))
.where(eq(users.id, userId))
.limit(1);
```

### 서비스 목록 (필터, 페이징)
```typescript
const { items, total } = await db.transaction(async (tx) => {
  const conditions = [
    eq(services.status, 'published'),
    search ? like(services.title, `%${search}%`) : undefined,
    categoryId ? eq(services.categoryId, categoryId) : undefined,
    minPrice ? gte(services.price, minPrice) : undefined,
    maxPrice ? lte(services.price, maxPrice) : undefined,
  ].filter(Boolean);

  const items = await tx.select({
    service: services,
    category: categories,
  })
  .from(services)
  .leftJoin(categories, eq(services.categoryId, categories.id))
  .where(and(...conditions))
  .orderBy(desc(services.createdAt))
  .limit(limit)
  .offset((page - 1) * limit);

  const [{ total }] = await tx.select({
    total: count()
  })
  .from(services)
  .where(and(...conditions));

  return { items, total };
});
```

### 주문 생성
```typescript
const order = await db.transaction(async (tx) => {
  // 서비스 조회
  const [service] = await tx.select()
    .from(services)
    .where(eq(services.id, serviceId))
    .limit(1);

  if (!service) throw new Error('Service not found');

  // 주문번호 생성
  const orderNumber = `${format(new Date(), 'yyyyMMdd')}-${randomId(6)}`;

  // 주문 생성
  const [newOrder] = await tx.insert(orders).values({
    orderNumber,
    userId,
    serviceId,
    planId,
    servicePrice: service.price,
    totalAmount: service.discountPrice || service.price,
    status: 'pending',
    paymentDueDate: addDays(new Date(), 3),
  }).returning();

  // 상태 이력 추가
  await tx.insert(orderStatusHistory).values({
    orderId: newOrder.id,
    newStatus: 'pending',
    createdBy: userId,
  });

  return newOrder;
});
```

### 리뷰 통계 업데이트
```typescript
// 트리거 또는 수동 업데이트
async function updateServiceRating(serviceId: number) {
  const stats = await db.select({
    avgRating: avg(reviews.rating),
    count: count(),
  })
  .from(reviews)
  .where(and(
    eq(reviews.serviceId, serviceId),
    eq(reviews.status, 'approved')
  ));

  await db.update(services)
    .set({
      averageRating: stats[0].avgRating || '0',
      reviewCount: stats[0].count,
      updatedAt: new Date(),
    })
    .where(eq(services.id, serviceId));
}
```

---

## 🔐 보안 고려사항

1. **인덱스 최적화**
   - 자주 조회되는 컬럼에 인덱스 추가
   - 복합 인덱스 고려 (userId + status 등)

2. **데이터 암호화**
   - 민감한 정보는 암호화 저장
   - OAuth 토큰은 별도 암호화

3. **Soft Delete 고려**
   - 실제 삭제 대신 deletedAt 컬럼 추가
   - 데이터 복구 가능성 확보

4. **트랜잭션 사용**
   - 중요한 작업은 트랜잭션으로 묶기
   - 데이터 일관성 보장

5. **타입 안정성**
   - Drizzle의 타입 추론 활용
   - zod와 함께 사용하여 런타임 검증