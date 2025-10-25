import {
  AccountProvider,
  Gender,
  UserRole,
  UserStatus,
} from "@internal/schemas";
import {
  index,
  pgEnum,
  pgTable,
  text,
  timestamp,
  unique,
} from "drizzle-orm/pg-core";
import { createdAt, cuidPrimaryKey, updatedAt } from "../../util/column";

export const roleEnum = pgEnum("role", [
  UserRole.ADMIN,
  UserRole.USER,
  UserRole.TUTOR,
]);

export const genderEnum = pgEnum("gender", [Gender.MALE, Gender.FEMALE]);

export const statusEnum = pgEnum("status", [
  UserStatus.PROCESSING,
  UserStatus.COMPLETED,
  UserStatus.CANCELLED,
]);

export const user = pgTable(
  "user",
  {
    id: cuidPrimaryKey(),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
    name: text("name").notNull(),
    username: text("username").notNull().unique(),
    phoneNumber: text("phone_number"),
    birthDate: timestamp("birth_date"),
    gender: genderEnum("gender"),
    email: text("email"),
    role: roleEnum("role").default(UserRole.USER).notNull(),
    status: statusEnum("status").default(UserStatus.PROCESSING).notNull(),
  },
  (table) => [index("user_email_idx").on(table.email)],
);

export const session = pgTable(
  "session",
  {
    id: cuidPrimaryKey(),
    expiresAt: timestamp("expires_at").notNull(),
    token: text("token").notNull().unique(),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accountId: text("account_id")
      .notNull()
      .references(() => account.id, { onDelete: "cascade" }),
  },
  (table) => [
    index("session_user_id_idx").on(table.userId),
    index("session_token_idx").on(table.token),
  ],
);

export const accountProviderEnum = pgEnum("account_provider", [
  AccountProvider.EMAIL,
  AccountProvider.GOOGLE,
  AccountProvider.NAVER,
  AccountProvider.KAKAO,
]);

export const account = pgTable(
  "account",
  {
    id: cuidPrimaryKey(),
    // social login이면 response에 포함된 id, email/password login이면 email
    accountId: text("account_id").notNull(),
    providerId: accountProviderEnum("provider_id").notNull(),
    email: text("email"),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
    scope: text("scope"),
    password: text("password"),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (table) => [
    unique("account_user_id_provider_id_unique").on(
      table.userId,
      table.providerId,
    ),
    index("account_user_id_idx").on(table.userId),
  ],
);
