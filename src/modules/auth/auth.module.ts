import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { AuthHelper } from 'src/helpers/auth.helper';
import { TokenJwtStrategy } from './jwt/token-jwt.strategy';
import config from 'src/config';
import { JwtStrategy } from './jwt/jwt.strategy';
import { ErrorHandler } from '../../utilities/error-handler.service';
import { Users } from 'src/database/entities/auth/Users';
import { UtilitiesService } from 'src/utilities/utilities.service';
import { EmailService } from 'src/utilities/email.service';
import { ErrorLogs } from 'src/database/entities/errors/ErrorLogs';

@Module({
  imports: [
    JwtModule.register({
      secret: config.auth.userKey,
      signOptions: { expiresIn: '30d' },
    }),
    TypeOrmModule.forFeature([
      Users,
      ErrorLogs,
    ]),
  ],
  providers: [
    JwtStrategy,
    TokenJwtStrategy,
    AuthService,
    AuthHelper,
    ErrorHandler,
    UtilitiesService,
    EmailService
  ],
  controllers: [AuthController],
})
export class AuthModule { }
