import type { Email } from "@internal/schemas";
import { IsEmail, IsString } from "class-validator";

export class EmailPasswordSignUpRequest {
  @IsEmail()
  readonly email!: Email;

  @IsString()
  readonly password!: string;

  @IsString()
  readonly name!: string;

  @IsString()
  readonly username!: string;
}
