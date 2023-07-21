import {
  BadRequestException,
  Injectable,
  NotAcceptableException,
  Inject
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Cache } from 'cache-manager';
import { Repository } from 'typeorm';
import { Users } from '../database/entities/auth/Users';
import { CreateAccountDto } from '../dtos/create-account.dto';
import { UtilitiesService } from '../utilities/utilities.service';
import { EmailService } from '../utilities/email.service';
import { ResponseDto, VerifyAccountFeedbckDto } from 'src/dtos/responses.dto';
import { VerifyAccountDto } from 'src/dtos/verify-account.dto';
import { LoginDto } from 'src/dtos/login.dto';

interface CreateUserResponse {
  user: Users;
  alreadyExists: boolean;
}

@Injectable()
export class AuthHelper {
  constructor(
    @InjectRepository(Users)
    private usersRepo: Repository<Users>,

    private utilService: UtilitiesService,
    private emailService: EmailService,

    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) { }


  async createUser(payload: CreateAccountDto): Promise<CreateUserResponse> {
    const existingUser = await this.usersRepo.findOne({
      where: { email: payload.email },
    });

    if (existingUser) {
      return {
        user: existingUser,
        alreadyExists: true,
      };
    }

    const user = await this.usersRepo.save(payload);

    await this.sendOTP(user);

    return {
      user,
      alreadyExists: false,
    };
  }


  async generateToken(): Promise<string> {
    const newToken = this.utilService.generatePIN(4);
    return newToken;
  }

  async sendOTP(user: Users): Promise<void> {

    const token = await this.generateToken();

    // store token in redis cache with user email as key
    const tokenObj = {
      token,
      created_at: Date.now(),
      reason: 'verify-mail'
    }
    console.log(tokenObj);
    await this.cacheManager.set(user.email, tokenObj, 0);

    await this.emailService.mailUser({
      to: user.email,
      subject: `Verify your account`,
      emailData: {
        firstname: '',
        transaction: `registration`,
        pin: token,
      },
      emailTemplate: 'verify-account',
    });
  }

  async confirmTokenValidity(
    user: Users,
    payload: {
      token: string;
      reason: TokenReason;
    },
  ): Promise<void> {
    const token: any = await this.cacheManager.get(user.email);

    if (!token) {
      throw new NotAcceptableException({
        message: `This OTP is incorrect`,
      });
    }

    const today = new Date();
    const tokenCreationDate = new Date(token.created_at);
    if (this.utilService.datediff(tokenCreationDate, today) > 3) {
      throw new NotAcceptableException({
        message: `Your OTP expired. Please generate a new OTP`,
      });
    }

    if (token.token !== payload.token || token.reason !== payload.reason) {
      throw new BadRequestException({
        message: `Wrong OTP provided`,
      });
    }

    await this.cacheManager.del(user.email);
  }

  async verifyAccount(
    user: Users,
    payload: VerifyAccountDto,
  ): Promise<VerifyAccountFeedbckDto> {
    await this.confirmTokenValidity(user, payload);
    await this.usersRepo.update(user.id, { isverified: true });

    await this.emailService.mailUser({
      to: user.email,
      subject: `Welcome To Node Auth Service`,
      emailData: {
        firstname: user.firstname,
      },
      emailTemplate: '',
    });

    user.password = undefined
    return {
      message: `Account verified`,
      user,
    };
  }

  async resendOTP(user: Users): Promise<ResponseDto> {
    const token = await this.generateToken();
    const tokenObj = {
      token,
      created_at: Date.now(),
      reason: 'verify-mail'
    }
    console.log(tokenObj);
    await this.cacheManager.set(user.email, tokenObj, 0);

    await this.emailService.mailUser({
      to: user.email,
      subject: `Verify your account`,
      emailData: {
        firstname: '',
        transaction: `registration`,
        pin: token,
      },
      emailTemplate: 'verify-account',
    });
    return {
      message: `OTP Resent`,
      data: {},
    };
  }

  async validateUser(
    payload: LoginDto,
  ): Promise<any> {
    const user = await this.usersRepo.findOne({ email: payload.email });
    if (!user) {
      return {
        status: 400,
        message: `Invalid credentials`,
        data: {},
      };
    }

    if (
      (await bcrypt.compare(
        payload.password,
        user.password,
      ))) {
      delete user.password;

      return user;
    }
    throw new BadRequestException({
      message: `Invalid credentials`,
      data: {},
    });
  }
}

export enum TokenReason {
  VERIFY_MAIL = 'verify-mail',
}
