import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, MinLength } from 'class-validator';

export class LoginDto {
    @ApiProperty({
        description: `Has to be a valid email`
    })
    @IsEmail({}, {
        message: `Please provide a valid email address`
    })
    email: string;

    @ApiProperty({
        description: `Has to be a valid password`
    })
    @MinLength(8, {
        message: `Please provide a valid password`,
    })
    password: string;

}

