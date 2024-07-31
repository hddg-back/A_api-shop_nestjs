import { Reflector } from '@nestjs/core';
import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { User } from 'src/auth/entities/user.entity';

@Injectable()
export class UserRoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const validRoles = this.reflector.get('roles', context.getHandler());
    if (!validRoles || !validRoles?.length) return true;

    const user = context.switchToHttp().getRequest()?.user as User;
    if (!user) throw new BadRequestException('Usuario no encontrado');

    for (const role of user.roles) if (validRoles.includes(role)) return true;

    throw new ForbiddenException(
      `Usiario no tiene un rol valido para esta endpoint`,
    );
  }
}
