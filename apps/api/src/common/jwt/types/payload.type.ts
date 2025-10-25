import { UserRole } from "@internal/schemas";

export type JwtPayload = {
  id: string; // user id
  email: string; // user email
  role: UserRole; // user role
};
