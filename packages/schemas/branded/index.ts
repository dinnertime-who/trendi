import z from "zod";

// bcrypt hashed string schema
export const BcryptHashedSchema = z.string().brand("BcryptHashed");
export type BcryptHashed = z.infer<typeof BcryptHashedSchema>;

// email schema
export const EmailSchema = z.email().brand("Email");
export type Email = z.infer<typeof EmailSchema>;

// phone number schema
export const KRPhoneNumberSchema = z
  .string()
  .regex(/^01[0-9]{1}-[0-9]{4}-[0-9]{4}$/)
  .brand("PhoneNumber");
export type KRPhoneNumber = z.infer<typeof KRPhoneNumberSchema>;
