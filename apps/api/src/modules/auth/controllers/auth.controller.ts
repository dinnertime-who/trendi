import { Body, Controller, Post } from "@nestjs/common";
import { RealIp } from "src/common/decorators/real-ip.decorator";
import { UserAgent } from "src/common/decorators/user-agent.decorator";
import { Public } from "src/common/jwt/decorators/public.decorator";
import { EmailPasswordService } from "../services/email-password.service";
import { EmailPasswordSignInRequest } from "./dto/request/email-password-sign-in.request";
import { EmailPasswordSignUpRequest } from "./dto/request/email-password-sign-up.request";

@Controller("auth")
export class AuthController {
  constructor(private readonly emailPasswordService: EmailPasswordService) {}

  @Public()
  @Post("sign-up/email-password")
  async emailPasswordSignUp(
    @RealIp() ip: string,
    @UserAgent() userAgent: string,
    @Body() request: EmailPasswordSignUpRequest,
  ) {
    return this.emailPasswordService.emailSignUp({
      ...request,
      ip,
      userAgent,
    });
  }

  @Public()
  @Post("sign-in/email-password")
  async emailPasswordSignIn(
    @RealIp() ip: string,
    @UserAgent() userAgent: string,
    @Body() request: EmailPasswordSignInRequest,
  ) {
    return this.emailPasswordService.emailSignIn({
      ...request,
      ip,
      userAgent,
    });
  }
}
