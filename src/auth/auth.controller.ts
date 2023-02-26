import {
  Controller,
  Post,
  UseGuards,
  Request,
  HttpCode,
  Body,
  Get,
  Req,
} from '@nestjs/common';
import { LocalAuthGuard } from './local-auth.guard';
import { ValidationPipe } from '../pipes/validator.pipe';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { AuthService } from './auth.service';
import { RefreshTokenGuard } from './refreshToken.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return req.user;
  }

  @Post('signup')
  @HttpCode(201)
  create(@Body(new ValidationPipe()) createUserDto: CreateUserDto) {
    return this.authService.signUp(createUserDto);
  }

  @UseGuards(RefreshTokenGuard)
  @Get('refresh')
  refreshTokens(
    @Req()
    req: Request & { user: { accessToken: string; sub: string; exp: number } },
    @Body() body: { refreshToken: string },
  ) {
    const userId = req.user['sub'];
    const expired = req.user['exp'];
    return this.authService.refreshTokens(userId, body.refreshToken, expired);
  }
}
