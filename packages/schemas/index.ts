import z from "zod";

export const UserRoleSchema = z.enum(["ADMIN", "USER", "TUTOR"]);

export const UserRole = UserRoleSchema.enum;
export type UserRole = z.infer<typeof UserRoleSchema>;

export const GenderSchema = z.enum(["MALE", "FEMALE"]);

export const Gender = GenderSchema.enum;
export type Gender = z.infer<typeof GenderSchema>;
