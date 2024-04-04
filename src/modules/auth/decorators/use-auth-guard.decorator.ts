import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { ApiCookieAuth, ApiForbiddenResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { Role } from '@prisma/client';

import { AuthGuard, RoleGuard } from '../guards';

export const UseAuthGuard = (role?: Role) => {
  const guards = [
    SetMetadata('role', role),
    UseGuards(AuthGuard, RoleGuard),
    ApiUnauthorizedResponse({ description: 'User is not authenticated' }),
    ApiCookieAuth('access-token'),
  ];

  if (role) guards.push(ApiForbiddenResponse({ description: `User does not have role ${role}` }));

  return applyDecorators(...guards);
};
