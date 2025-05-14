// guards/admin.guard.ts
import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { UserType } from '../entities/enums/user-type.enum';
import { User } from 'src/entities/user.entity';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const userRole = request.role;
    if (!userRole || userRole !== UserType.ADMIN) {
      throw new ForbiddenException('Admin access required');
    }
    return true;
  }
}