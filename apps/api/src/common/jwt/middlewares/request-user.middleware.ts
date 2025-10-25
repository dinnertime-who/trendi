import { tryCatch } from "@internal/utils";
import { Injectable, NestMiddleware } from "@nestjs/common";
import type { Response } from "express";
import { NextFunction } from "express";
import { JwtService } from "../services/jwt.service";
import { RequestWithUser } from "../types/request.type";

@Injectable()
export class RequestUserMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) {}

  async use(req: RequestWithUser, _: Response, next: NextFunction) {
    const token = this.jwtService.extractTokenFromHeader(req);
    const { data, ok } = await this.validateToken(token);
    req.user = { data, isValid: ok };

    next();
  }

  private validateToken(token: string | null) {
    return tryCatch(async () => {
      if (!token) {
        throw new Error("Unauthorized");
      }
      return this.jwtService.verifyJwt(token, "accessToken");
    });
  }
}
