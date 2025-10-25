import { Module } from "@nestjs/common";
import { BcryptModule } from "src/common/bcrypt/bcrypt.module";
import { AuthController } from "./controllers/auth.controller";
import { EmailPasswordService } from "./services/email-password.service";

@Module({
  imports: [BcryptModule],
  controllers: [AuthController],
  providers: [EmailPasswordService],
})
export class AuthModule {}
