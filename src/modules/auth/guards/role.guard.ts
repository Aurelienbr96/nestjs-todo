import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@prisma/client';

import { AuthPayload } from '../type';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRole = this.reflector.getAllAndOverride<Role>('role', [context.getHandler(), context.getClass()]);
    if (!requiredRole) {
      return true;
    }
    const user = context.switchToHttp().getRequest().user as AuthPayload;
    console.log('user role', user.role, requiredRole);
    return requiredRole === user.role;
  }
}
