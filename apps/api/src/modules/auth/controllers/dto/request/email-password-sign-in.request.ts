import type { Email } from "@internal/schemas";
import { IsEmail, IsString } from "class-validator";

export class EmailPasswordSignInRequest {
  @IsEmail()
  readonly email!: Email;

  @IsString()
  readonly password!: string;
}
