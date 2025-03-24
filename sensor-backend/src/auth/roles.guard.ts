import {
    CanActivate,
    ExecutionContext,
    Injectable,
    ForbiddenException
  } from '@nestjs/common';
  import { Reflector } from '@nestjs/core';
  import { ROLES_KEY } from './roles.decarator'; 
  import { UserRole } from '../users/user.entity';
  
  @Injectable()
  export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}
  
    canActivate(context: ExecutionContext): boolean {
      const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
        context.getHandler(),
        context.getClass(),
      ]);
  
      if (!requiredRoles) {
        return true;
      }
  
      const request = context.switchToHttp().getRequest();
      const user = request.user;
  
      if (!user) {
        throw new ForbiddenException('Kullanıcı doğrulanamadı.');
      }
  
      if (!requiredRoles.includes(user.role)) {
        throw new ForbiddenException('Bu işlemi yapmaya yetkiniz yok.');
      }
  
      return true;
    }
  }