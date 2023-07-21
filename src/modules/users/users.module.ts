import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import config from 'src/config';
import { Users } from 'src/database/entities/auth/Users';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [
    JwtModule.register({
      secret: config.auth.userKey,
      signOptions: { expiresIn: '30d' },
    }),
    TypeOrmModule.forFeature([
      Users,
    ]),
  ],
  providers: [
    UsersService,
  ],
  controllers: [UsersController],
})
export class UsersModule { }
