import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class TokenJwtAuthGuard extends AuthGuard('token-jwt') { }
