import { UserRole } from "@internal/schemas";
import { SetMetadata } from "@nestjs/common";

/**
 * 권한 데코레이터
 * 이 데코레이터가 붙은 라우트는 해당 권한을 가진 사용자만 접근할 수 있다
 */
export const ROLES_KEY = "roles";
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
