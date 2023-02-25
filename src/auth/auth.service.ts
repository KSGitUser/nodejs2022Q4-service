import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}

  async validateUser(
    login: string,
    pass: string,
  ): Promise<Omit<User, 'password'> | null> {
    const user = await this.userService.findOneByLogin(login);
    if (user && user.password === pass) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }
}
