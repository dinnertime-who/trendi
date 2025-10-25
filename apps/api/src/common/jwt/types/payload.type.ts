import { UserRole, UserStatus } from "@internal/schemas";

export type JwtPayload = {
  sub: string; // jwt id
  email: string; // user email
  role: UserRole; // user role
  status: UserStatus; // user status
};

export type JwtResult = JwtPayload & {
  iat: number;
  exp: number;
};
