import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Users } from 'src/database/entities/auth/Users';
import { createQueryBuilder } from 'typeorm';
import config from 'src/config'


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest:
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.auth.userKey,
    });
  }


  async validate(payload: Users) {
    const user = await createQueryBuilder(Users, 'user')
      .getOne();
    if (!user) {
      throw new UnauthorizedException('Authorization failed');
    }
    return user;
  }

}