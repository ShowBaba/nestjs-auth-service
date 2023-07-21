import {
  Controller,
  Get,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { TokenJwtAuthGuard } from '../auth/jwt/token-jwt.guard';
import { UsersService } from './users.service';


@Controller('users')
export class UsersController {
  constructor(private readonly service: UsersService) { }

  /**
   * Get a user's profile
   */
  @ApiOperation({ summary: `Helps a user get their profile` })
  @ApiTags(`Users`)
  @UseGuards(TokenJwtAuthGuard)
  @Get('')
  getProfile(@Request() req: any) {
    return this.service.getProfile(req.user);
  }
}