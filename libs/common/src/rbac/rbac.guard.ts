import { CanActivate, ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from './rbac.decorator';
import type { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { ROLE_TO_PERMISSIONS } from './roles';

@Injectable()
export class RbacGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @Inject(CACHE_MANAGER) private readonly cache: Cache
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const required = this.reflector.getAllAndOverride<string[]>(PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass()
    ]) ?? [];
    if (required.length === 0) return true;
    const req = context.switchToHttp().getRequest();
    const userId: string | undefined = req.user?.sub;
    const userRoles: string[] = Array.isArray(req.user?.roles) ? req.user.roles : [];
    let userPermissions: string[] = req.user?.permissions ?? [];

    if ((!userPermissions || userPermissions.length === 0) && userId) {
      const cached = await this.cache.get<string[]>(`perm:${userId}`);
      if (cached) {
        userPermissions = cached;
      }
    }

    // Derive permissions from roles when not explicitly present
    if (!userPermissions || userPermissions.length === 0) {
      const derived = new Set<string>();
      for (const role of userRoles) {
        const roleKey = String(role).toLowerCase() as keyof typeof ROLE_TO_PERMISSIONS;
        const permsForRole = ROLE_TO_PERMISSIONS[roleKey] ?? [];
        for (const p of permsForRole) derived.add(p);
      }
      userPermissions = Array.from(derived);
    }

    const ok = required.every(p => userPermissions.includes(p));
    if (userId && userPermissions?.length) {
      await this.cache.set(`perm:${userId}`, userPermissions, 60_000);
    }
    return ok;
  }
}


