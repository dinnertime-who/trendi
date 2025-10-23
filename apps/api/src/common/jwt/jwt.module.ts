import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtModule as NestJwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import type { Configuration } from "src/config/configuration";
import { JwtService } from "./jwt.service";
import { JwtStrategy } from "./jwt.strategy";
import { JwtAuthGuard } from "./jwt-auth.guard";

@Module({
  imports: [
    PassportModule,
    NestJwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService<Configuration>) => {
        const config = configService.getOrThrow("jwt", { infer: true });
        return {
          secret: config.secret,
          signOptions: {
            expiresIn: config.expiresIn,
          },
        };
      },
    }),
  ],
  providers: [JwtService, JwtStrategy, JwtAuthGuard],
  exports: [JwtService, JwtAuthGuard],
})
export class JwtModule {}
