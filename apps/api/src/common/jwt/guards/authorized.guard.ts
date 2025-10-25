import { UserRole } from "@internal/schemas";
import { CanActivate, ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ROLES_KEY } from "../decorators/roles.decorator";
import { RequestWithUser } from "../types/request.type";

export class AuthorizedGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const roles = this.getRoles(context);
    return (
      request.user.isValid &&
      !!request.user.data?.role &&
      roles.includes(request.user.data.role)
    );
  }

  private getRoles(context: ExecutionContext) {
    return (
      this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
        context.getHandler(),
        context.getClass(),
      ]) || []
    );
  }
}
