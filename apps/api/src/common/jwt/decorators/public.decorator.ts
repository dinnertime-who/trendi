import { SetMetadata } from "@nestjs/common";

/**
 * Public 라우트 마커
 * 이 데코레이터가 붙은 라우트는 JWT 인증을 건너뛴다
 */
export const IS_PUBLIC_KEY = "isPublic";
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
