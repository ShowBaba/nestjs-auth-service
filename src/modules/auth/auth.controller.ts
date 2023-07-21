import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiHeader,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import {
  Controller, Post, Body, Put, Patch, UseGuards,
  Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAccountDto } from '../../dtos/create-account.dto';
import { LoginFeedbackDto, RegisterFeedbackDto, ResponseDto } from '../../dtos/responses.dto';
import { VerifyAccountDto } from 'src/dtos/verify-account.dto';
import { JwtAuthGuard } from './jwt/jwt-auth.guard';
import { LoginDto } from 'src/dtos/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private service: AuthService) { }

  @ApiOperation({ summary: `Helps a user create an account` })
  @ApiTags(`User Auth`)
  @ApiCreatedResponse({
    description: `User was successfully created`,
  })
  @Post('create-account')
  async createAccount(
    @Body() payload: CreateAccountDto,
  ): Promise<RegisterFeedbackDto> {
    return this.service.createAccount(payload);
  }

  /**
   * Account Verification
   */
  @ApiOperation({ summary: `Helps a user verify their account` })
  @ApiTags(`User Auth`)
  @ApiHeader({
    name: 'Authorization',
    description: 'Set your bearer with this header',
  })
  @ApiCreatedResponse({
    description: `User was successfully verified`,
  })
  @ApiBadRequestResponse({
    description: `Something is wrong with the request payload or verification code is wrong`,
  })
  @ApiForbiddenResponse({
    description: `Verification code expired`,
  })
  @ApiUnauthorizedResponse({
    description: `Either you didn't set your bearer or you set an invalid bearer`,
  })
  @UseGuards(JwtAuthGuard)
  @Post('verify-account')
  async verifyAccount(@Body() payload: VerifyAccountDto, @Request() req: any) {
    return this.service.verifyAccount(req.user, payload);
  }

  /**
   * Resend OTP
   */
  @ApiOperation({
    summary: `Resends OTP to a user when they're trying to verify their account`,
  })
  @ApiTags(`User Auth`)
  @ApiHeader({
    name: 'Authorization',
    description: 'Set your bearer with this header',
  })
  @ApiCreatedResponse({
    description: `OTP was resent`,
    type: ResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: `Either you didn't set your bearer or you set an invalid bearer`,
  })
  @UseGuards(JwtAuthGuard)
  @Put('resend-otp')
  async resendOTP(@Request() req: any) {
    return this.service.resendOTP(req.user);
  }

  /**
   * Login
   */
  @ApiOperation({
    summary: `Helps a user get a verification token to access their account`,
  })
  @ApiTags(`User Auth`)
  @ApiCreatedResponse({
    description: `OTP was resent`,
    type: LoginFeedbackDto,
  })
  @ApiForbiddenResponse({
    description: `Any number of things cold go wrong`,
  })
  @Post('login')
  async login(@Body() payload: LoginDto, @Request() req: any) {
    return this.service.login(payload);
  }
}