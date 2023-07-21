import { ApiProperty } from "@nestjs/swagger";
import { Users } from "../database/entities/auth/Users";

export class RegisterPayload {
  @ApiProperty({
    description: `A token with which you can verify the user's OTP`
  })
  token: string;
}

export class LoginPayload {
  @ApiProperty({
    description: `A bearer for your requests`
  })
  token: string;

  @ApiProperty({
    description: `The user's details`,
    type: Users
  })
  user: Users
}

export class RegisterFeedbackDto {
  @ApiProperty({
    description: `Successful message (please do not display this to the user)`
  })
  message: string;

  @ApiProperty({
    description: `Contains the email of the registered user`,
    type: RegisterPayload
  })
  data: RegisterPayload;
}

export class VerifyAccountFeedbckDto {
  @ApiProperty({
    description: `String explaining the response`
  })
  message: string;

  @ApiProperty({
    description: `Contains the data that explains the error`,
    type: Users
  })
  user: any;
}

export class ResponseDto {
  @ApiProperty({
    description: `String explaining the response`
  })
  message: string;

  @ApiProperty({
    description: `Contains the data that explains the error`
  })
  data: any;
}

export class LoginFeedbackDto {
  @ApiProperty({
    description: `Successful message (please do not display this to the user)`
  })
  message: string;

  @ApiProperty({
    description: `Contains the email of the registered user`,
    type: LoginPayload
  })
  data: LoginPayload;
}