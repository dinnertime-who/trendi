import {
  type ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthGuard } from "@nestjs/passport";
import { IS_PUBLIC_KEY } from "./decorators/public.decorator";

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    // @Public() 데코레이터가 있는지 확인
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // Public 라우트면 인증 스킵
    if (isPublic) {
      return true;
    }

    // 그 외에는 JWT 인증 수행
    return super.canActivate(context);
  }

  handleRequest<TUser = any>(err: Error | null, user: TUser, info: any): TUser {
    // 에러가 있거나 사용자가 없으면 UnauthorizedException 던지기
    if (err || !user) {
      throw (
        err ||
        new UnauthorizedException(
          info?.message || "인증에 실패했습니다. 다시 로그인해주세요.",
        )
      );
    }
    return user;
  }
}
