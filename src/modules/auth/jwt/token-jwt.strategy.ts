import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Users } from 'src/database/entities/auth/Users';
import { createQueryBuilder } from 'typeorm';
import config from 'src/config';

@Injectable()
export class TokenJwtStrategy extends PassportStrategy(Strategy, 'token-jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.auth.userKey,
    });
  }

  async validate(payload: Users) {
    const user = await createQueryBuilder(Users, 'user')
      .where({ id: payload.id })
      .getOne();

    if (!user) {
      throw new UnauthorizedException('Authorization failed');
    }
    if (!user.isverified) {
      throw new ForbiddenException({
        message: 'Please verify your email address to perform actions',
      });
    }

    return user;
  }
}
