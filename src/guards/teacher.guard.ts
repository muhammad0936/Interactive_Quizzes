// guards/admin.guard.ts
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { UserType } from '../entities/enums/user-type.enum';
import { User } from 'src/entities/user.entity';

@Injectable()
export class TeacherGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    // return true;
    const request = context.switchToHttp().getRequest();
    const userRole = request.role;
    if (!userRole || userRole !== UserType.TEACHER) {
      throw new ForbiddenException('Teacher access required');
    }
    return true;
  }
}
