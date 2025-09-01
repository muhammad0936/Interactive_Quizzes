// guards/admin.guard.ts
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { UserType } from '../entities/enums/user-type.enum';

@Injectable()
export class StudentGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    //return true;
    const request = context.switchToHttp().getRequest();
    const userRole = request.role;
    console.log(userRole);
    if (!userRole || userRole !== UserType.STUDENT) {
      throw new ForbiddenException('Student access required');
    }
    return true;
  }
}
