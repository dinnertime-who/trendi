import { createParamDecorator, type ExecutionContext } from "@nestjs/common";

export interface CurrentUserData {
  userId: string;
  email: string;
  role: string;
}

/**
 * 현재 로그인한 사용자 정보를 가져오는 데코레이터
 *
 * @example
 * ```ts
 * @Get('profile')
 * @UseGuards(JwtAuthGuard)
 * getProfile(@CurrentUser() user: CurrentUserData) {
 *   return { userId: user.userId, email: user.email };
 * }
 * ```
 */
export const CurrentUser = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): CurrentUserData => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
