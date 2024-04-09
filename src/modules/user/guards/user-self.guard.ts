import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';

@Injectable()
export class UserSelfGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const { sub: userId, role } = request.user;

    const userIdBeingUpdated = parseInt(request.params.id);

    return userId === userIdBeingUpdated || role === 'ADMIN';
  }
}
