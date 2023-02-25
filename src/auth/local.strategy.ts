import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from '@prisma/client';
import { ForbiddenException } from '@nestjs/common/exceptions/forbidden.exception';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'login' });
  }

  async validate(
    login: string,
    password: string,
  ): Promise<Omit<User, 'password'>> {
    if (typeof login !== 'string' || typeof password !== 'string') {
      throw new BadRequestException();
    }
    const user = await this.authService.validateUser(login, password);
    if (!user) {
      throw new ForbiddenException('Wrong login or password');
    }
    return user;
  }
}
