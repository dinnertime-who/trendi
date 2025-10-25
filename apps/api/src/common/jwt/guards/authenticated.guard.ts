import { CanActivate, type ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { IS_PUBLIC_KEY } from "../decorators/public.decorator";
import { RequestWithUser } from "../types/request.type";

@Injectable()
export class AuthenticatedGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  async canActivate(context: ExecutionContext) {
    const request = this.getRequest(context);
    const isPublic = this.isPublic(context);

    if (isPublic) return true;
    return request.user.isValid;
  }

  private getRequest(context: ExecutionContext): RequestWithUser {
    return context.switchToHttp().getRequest<RequestWithUser>();
  }

  private isPublic(context: ExecutionContext) {
    return (
      this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
        context.getHandler(),
        context.getClass(),
      ]) || false
    );
  }
}
