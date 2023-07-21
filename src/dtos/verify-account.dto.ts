import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';
import { TokenReason } from 'src/helpers/auth.helper';

export class VerifyAccountDto {
    @ApiProperty({
        description: `Provide the otp here`
    })
    @MinLength(4, {
        message: `Token too short`
    })
    @MaxLength(4, {
        message: `Token too long`
    })
    token: string;

    @ApiProperty({
      description: `The reason for the token e.g verify-mail`,
        type: 'enum',
        enum: TokenReason
    })
    @IsNotEmpty({
        message: `Invalid token reason`
    })
    reason: TokenReason;

}