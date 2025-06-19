// middleware/attach-role.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from '../modules/user/user.repository';
import { User } from 'src/entities/user.entity';

@Injectable()
export class AttachRoleMiddleware implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userRepository: UserRepository<User>,
  ) {}

  async use(req: Request, _res: Response, next: NextFunction) {
    // 1. Extract JWT from `Authorization` header
    const authHeader = req.headers.authorization;
    if (!authHeader) return next();

    const token = authHeader.split(' ')[1]; // Bearer <token>
    try {
      const payload = this.jwtService.verify(token, {
        secret: 'thisismysecretkey',
      });
      const { userId, email, role } = payload;

      const user = await this.userRepository.findOneById(userId);
      if (!user) return next();

      req.role = user.userType;
    } catch (error) {
      console.error('JWT error:', error);
    }
    next();
  }
}
