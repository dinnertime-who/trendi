import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import type { Request } from "express";

export const UserAgent = createParamDecorator(
  (_: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    return request.headers["user-agent"];
  },
);
