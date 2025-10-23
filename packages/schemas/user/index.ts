import z from "zod";

export const UserRoleSchema = z.enum([
  "ADMIN", // 사이트 관리자
  "USER", // 일반 사용자
  "TUTOR", // 강사
]);

export const UserRole = UserRoleSchema.enum;
export type UserRole = z.infer<typeof UserRoleSchema>;

export const GenderSchema = z.enum([
  "MALE", // 남성
  "FEMALE", // 여성
]);

export const Gender = GenderSchema.enum;
export type Gender = z.infer<typeof GenderSchema>;

export const UserStatusSchema = z.enum([
  "PROCESSING", // 가입 진행중
  "COMPLETED", // 가입 완료
  "CANCELLED", // 가입 취소
]);

export const UserStatus = UserStatusSchema.enum;
export type UserStatus = z.infer<typeof UserStatusSchema>;

export const AccountProviderSchema = z.enum([
  "EMAIL", // 이메일
  "GOOGLE", // 구글
  "NAVER", // 네이버
  "KAKAO", // 카카오
]);

export const AccountProvider = AccountProviderSchema.enum;
export type AccountProvider = z.infer<typeof AccountProviderSchema>;
