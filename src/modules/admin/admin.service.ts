import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { AdminRepository } from './admin.repository';
import { BaseService } from 'src/common/base.service';
import { Admin } from 'src/entities/admin.entity';
import { UserType } from 'src/entities/enums/user-type.enum';
import { hash } from 'bcryptjs';
import { LoginAdminDto } from './dto/login-admin.dto';
import { compare } from 'bcryptjs';

@Injectable()
export class AdminService {
  constructor(private readonly adminRepository: AdminRepository) {}
  async ensureIsAdmin(id: string): Promise<Boolean> {
    const admin = await this.adminRepository.exists({
      userType: UserType.ADMIN,
      _id: id,
    });
    return admin ? true : false;
  }

  async createAdmin({ email, name, password }: CreateAdminDto): Promise<Admin> {
    const isExsist = await this.adminRepository.exists({ email });
    if (isExsist)
      throw new BadRequestException('This email is already registered.');
    const hashedPassword = await hash(password, 12);
    const admin = await this.adminRepository.create({
      email,
      name,
      password: hashedPassword,
      userType: UserType.ADMIN,
    });
    return admin;
  }

  async checkLoginData({ email, password }: LoginAdminDto): Promise<Admin> {
    const admin = await this.adminRepository.findByEmailWithPassword(email);
    if (!admin) throw new BadRequestException('Invalid login data');
    const isMatchPassword = await compare(password, admin.password);
    if (!isMatchPassword) throw new BadRequestException('Invalid login data');
    return admin;
  }
}
