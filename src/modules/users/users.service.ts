import {  Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/database/entities/auth/Users';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private usersRepo: Repository<Users>,
  ) { }

  getProfile(user: Users): Promise<Users> {
    return this.usersRepo.findOne({
      where: { email: user.email },
    });
  }
}