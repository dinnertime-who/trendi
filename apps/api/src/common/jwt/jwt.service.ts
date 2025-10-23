import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService as NestJwtService } from "@nestjs/jwt";
import type { Configuration } from "src/config/configuration";

export interface JwtPayload {
  sub: string; // user id
  email: string;
  role: string;
}

@Injectable()
export class JwtService {
  constructor(
    private readonly nestJwtService: NestJwtService,
    private readonly configService: ConfigService<Configuration>,
  ) {}

  /**
   * Access Token 생성
   * @param payload JWT 페이로드 (userId, email, role)
   * @returns JWT Access Token (15분 만료)
   */
  generateAccessToken(payload: JwtPayload): string {
    const config = this.configService.get("jwt", { infer: true });
    return this.nestJwtService.sign(payload, {
      secret: config?.secret,
      expiresIn: config?.expiresIn,
    });
  }

  /**
   * Refresh Token 생성
   * @param payload JWT 페이로드 (userId, email, role)
   * @returns JWT Refresh Token (7일 만료)
   */
  generateRefreshToken(payload: JwtPayload): string {
    const config = this.configService.get("refreshToken", { infer: true });
    return this.nestJwtService.sign(payload, {
      secret: config?.secret,
      expiresIn: config?.expiresIn,
    });
  }

  /**
   * Access Token과 Refresh Token을 함께 생성
   * @param payload JWT 페이로드
   * @returns { accessToken, refreshToken }
   */
  generateTokens(payload: JwtPayload): {
    accessToken: string;
    refreshToken: string;
  } {
    return {
      accessToken: this.generateAccessToken(payload),
      refreshToken: this.generateRefreshToken(payload),
    };
  }

  /**
   * Access Token 검증 및 디코딩
   * @param token JWT Access Token
   * @returns 디코딩된 페이로드
   */
  verifyAccessToken(token: string): JwtPayload {
    const config = this.configService.get("jwt", { infer: true });
    return this.nestJwtService.verify<JwtPayload>(token, {
      secret: config?.secret,
    });
  }

  /**
   * Refresh Token 검증 및 디코딩
   * @param token JWT Refresh Token
   * @returns 디코딩된 페이로드
   */
  verifyRefreshToken(token: string): JwtPayload {
    const config = this.configService.get("refreshToken", { infer: true });
    return this.nestJwtService.verify<JwtPayload>(token, {
      secret: config?.secret,
    });
  }

  /**
   * 토큰 디코딩 (검증 없이)
   * @param token JWT Token
   * @returns 디코딩된 페이로드
   */
  decode(token: string): JwtPayload | null {
    return this.nestJwtService.decode<JwtPayload>(token);
  }
}
