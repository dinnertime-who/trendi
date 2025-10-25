import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService as NestJwtService } from "@nestjs/jwt";
import type { Configuration } from "src/config/configuration";
import type { JwtPayload } from "../types/payload.type";
import { RequestWithUser } from "../types/request.type";

@Injectable()
export class JwtService {
  constructor(
    private readonly nestJwtService: NestJwtService,
    private readonly configService: ConfigService<Configuration>,
  ) {}

  generateJwt(payload: JwtPayload, type: "accessToken" | "refreshToken") {
    const config = this.getConfig(type);
    return {
      token: this.signByConfig(config, payload),
      expiresIn: Date.now() + config.expiresIn * 1000,
    };
  }

  generateJwts(payload: JwtPayload) {
    const accessToken = this.generateJwt(payload, "accessToken");
    const refreshToken = this.generateJwt(payload, "refreshToken");
    return { accessToken, refreshToken };
  }

  verifyJwt(token: string, type: "accessToken" | "refreshToken") {
    const config = this.getConfig(type);
    return this.verifyByConfig(config, token);
  }

  extractTokenFromHeader(request: RequestWithUser) {
    const authorization = request.headers.authorization || "";
    return authorization.startsWith("Bearer ")
      ? authorization.split(" ")[1]
      : null;
  }

  private getConfig(key: "accessToken" | "refreshToken") {
    return this.configService.getOrThrow(key, { infer: true });
  }

  private signByConfig(
    config: Configuration["accessToken" | "refreshToken"],
    payload: JwtPayload,
  ) {
    return this.nestJwtService.sign(payload, {
      secret: config.secret,
      expiresIn: config.expiresIn,
    });
  }

  private verifyByConfig(
    config: Configuration["accessToken" | "refreshToken"],
    token: string,
  ) {
    return this.nestJwtService.verify<JwtPayload>(token, {
      secret: config.secret,
    });
  }
}
