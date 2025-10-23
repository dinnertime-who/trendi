import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import type { Configuration } from "src/config/configuration";
import type { JwtPayload } from "./jwt.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(readonly configService: ConfigService<Configuration>) {
    const config = configService.getOrThrow("jwt", { infer: true });

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.secret,
    });
  }

  /**
   * JWT 토큰이 검증된 후 실행되는 메서드
   * @param payload JWT 페이로드
   * @returns 검증된 사용자 정보 (req.user에 저장됨)
   */
  async validate(payload: JwtPayload) {
    if (!payload.sub || !payload.email) {
      throw new UnauthorizedException("유효하지 않은 토큰입니다");
    }

    // req.user에 저장될 객체
    return {
      userId: payload.sub,
      email: payload.email,
      role: payload.role,
    };
  }
}
