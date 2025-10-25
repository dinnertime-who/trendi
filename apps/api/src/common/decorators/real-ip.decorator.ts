import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import type { Request } from "express";

export const RealIp = createParamDecorator(
  (_: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();

    return (
      request.ip ||
      request.headers["x-forwarded-for"] ||
      request.headers["cf-connecting-ip"] ||
      request.headers["x-real-ip"]
    );
  },
);
