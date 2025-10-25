import { createParamDecorator, type ExecutionContext } from "@nestjs/common";
import { RequestWithUser } from "../types/request.type";

/**
 * 현재 로그인한 사용자 정보를 가져오는 데코레이터
 */
export const ReqUser = createParamDecorator(
  (_: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<RequestWithUser>();
    return request.user;
  },
);
