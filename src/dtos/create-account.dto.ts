import { ApiProperty } from '@nestjs/swagger';
import { MinLength, IsEmail, Length, IsOptional } from 'class-validator';
import { EmailNotRegistered } from 'src/validators/EmailNotRegistered';
import { IsValidPhoneNumber } from 'src/validators/IsValidPhonenumber';
import { PhoneNumberNotRegistered } from 'src/validators/PhoneNumberNotRegistered';
import { UsernameNotRegistered } from 'src/validators/UsernameNotRegistered';
export class CreateAccountDto {
  firstname?: string;

  lastname?: string;

  @ApiProperty()
  @UsernameNotRegistered({
    message: `This username is already registered`,
  })
  @MinLength(2, {
    message: `Please provide a valid username.`,
  })
  username: string;

  @ApiProperty({
    description: `Has to be an email address that has not been registered on the system yet`,
  })
  @IsEmail(
    {},
    {
      message: `Please provide a valid email address`,
    },
  )
  @EmailNotRegistered({
    message: `This email is already registered`,
  })
  email: string;

  @ApiProperty({
    description: `Has to be a valid phone number that has not been registered yet`,
  })
  @PhoneNumberNotRegistered({
    message: `This phone number is already registered`,
  })
  @IsValidPhoneNumber({
    message: `Please provide a valid phone number`,
  })
  phonenumber: string;

  @ApiProperty({
    description: `Has to be at least 8 characters`,
  })
  @MinLength(8, {
    message: `Password has to be a minimum of 8 characters.`,
  })
  password: string;
}
