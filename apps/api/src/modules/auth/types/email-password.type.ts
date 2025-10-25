import { Email } from "@internal/schemas";

export type EmailSignInParams = {
  email: Email;
  password: string;
  ip: string;
  userAgent: string;
};

export type EmailSignUpParams = {
  email: Email;
  password: string;
  name: string;
  username: string;
  ip: string;
  userAgent: string;
};
