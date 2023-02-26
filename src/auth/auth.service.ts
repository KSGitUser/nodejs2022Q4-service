import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../user/dto/create-user.dto';
import * as argon2 from 'argon2';
import { ForbiddenException } from '@nestjs/common/exceptions/forbidden.exception';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UserService)) private userService: UserService,
    private jwtService: JwtService,
  ) {}

  hashData(data: string) {
    return argon2.hash(data);
  }

  async getTokens(userId: string, login: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          userId: userId,
          login,
        },
        {
          secret: process.env.JWT_SECRET_KEY,
          expiresIn: process.env.TOKEN_EXPIRE_TIME,
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          userId: userId,
          login,
        },
        {
          secret: process.env.JWT_SECRET_REFRESH_KEY,
          expiresIn: process.env.TOKEN_REFRESH_EXPIRE_TIME,
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async updateRefreshToken(userId: string, refreshToken: string) {
    const hashedRefreshToken = refreshToken;
    await this.userService.updateRefreshToken(userId, {
      refreshToken: hashedRefreshToken,
    });
  }

  async updateAccessToken(userId: string, accessToken: string) {
    const hashedAccessedToken = accessToken;
    return await this.userService.updateAccessToken(userId, {
      accessToken: hashedAccessedToken,
    });
  }

  async signUp(createUserDto: CreateUserDto): Promise<any> {
    const userExists = await this.userService.findOneByLogin(
      createUserDto.login,
    );
    if (userExists) {
      throw new BadRequestException('User already exists');
    }
    const newUser = await this.userService.create({
      ...createUserDto,
    });
    const tokens = await this.getTokens(newUser.id, newUser.login);
    await this.updateRefreshToken(newUser.id, tokens.refreshToken);
    const updatedUser = await this.updateAccessToken(
      newUser.id,
      tokens.accessToken,
    );
    return { ...updatedUser, ...tokens };
  }

  async signIn(data: { login: string; password: string }) {
    const user = await this.userService.findOneByLogin(data.login);
    if (!user) throw new ForbiddenException('Wrong login or password');
    const passwordMatches = await argon2.verify(user.password, data.password);
    if (!passwordMatches)
      throw new ForbiddenException('Wrong login or password');
    const tokens = await this.getTokens(user.id, user.login);
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    const updatedUser = await this.updateAccessToken(
      user.id,
      tokens.accessToken,
    );
    return updatedUser;
  }
}
