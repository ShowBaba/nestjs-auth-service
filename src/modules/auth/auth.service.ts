import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ErrorHandler } from '../../utilities/error-handler.service';
import { CreateAccountDto } from '../../dtos/create-account.dto';
import { LoginFeedbackDto, RegisterFeedbackDto, ResponseDto, VerifyAccountFeedbckDto } from '../../dtos/responses.dto';
import { AuthHelper } from '../../helpers/auth.helper';
import { Users } from 'src/database/entities/auth/Users';
import { VerifyAccountDto } from 'src/dtos/verify-account.dto';
import { LoginDto } from 'src/dtos/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly errorHandler: ErrorHandler,
    private readonly authHelper: AuthHelper,
    private jwt: JwtService,
  ) { }

  async createAccount(payload: CreateAccountDto): Promise<RegisterFeedbackDto> {
    try {
      payload.password = await bcrypt.hash(payload.password, 10);
      const result = await this.authHelper.createUser(payload)
      if (result.alreadyExists) {
        throw new BadRequestException({
          message: `You already have an account, please login`,
        });
      }
      return {
        message: `User created`,
        data: {
          token: this.jwt.sign({
            id: result.user.id,
            email: payload.email,
            isactive: false,
          }),
        },
      };

    } catch (error) {
      await this.errorHandler.handle({
        error,
        entity: 'Users',
        source: `AuthService.Register`,
      });
    }
  }

  async verifyAccount(
    user: Users,
    payload: VerifyAccountDto,
  ): Promise<VerifyAccountFeedbckDto> {
    try {
      return await this.authHelper.verifyAccount(user, payload);
    } catch (error) {
      await this.errorHandler.handle({
        error,
        userid: user.id,
        entity: 'Tokens',
        source: `AuthService.VerifyAccount`,
      });
    }
  }

  async resendOTP(user: Users): Promise<ResponseDto> {
    try {
      return await this.authHelper.resendOTP(user);
    } catch (error) {
      await this.errorHandler.handle({
        error,
        userid: user.id,
        entity: 'Tokens',
        source: `AuthService.ResendOTP`,
      });
    }
  }

  async login(
    payload: LoginDto,
  ): Promise<LoginFeedbackDto> {
    try {
      const user = await this.authHelper.validateUser(payload);

      if (user.status === 400) {
        throw new BadRequestException(`${user.message}`);
      }
      if (user.status === 406) {
        return user;
      }
      return {
        message: `Login successful`,
        data: {
          token: this.jwt.sign({
            id: user.id,
            email: user.email,
          }),
          user,
        },
      };
    } catch (error) {
      await this.errorHandler.handle({
        error,
        entity: 'Users',
        source: `AuthService.Login`,
      });
    }
  }
}