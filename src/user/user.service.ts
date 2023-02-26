import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserPasswordDto } from './dto/update-user-password.dto';
import { User as UseModel } from './entities/user.entity';
import { HelpersService } from '../helpers/helpers.service';
import { ForbiddenException } from '@nestjs/common/exceptions/forbidden.exception';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';
import * as argon2 from 'argon2';
import { omit } from 'lodash';
import { AuthService } from '../auth/auth.service';

const USER_SELECT_FIELDS = {
  id: true,
  login: true,
  version: true,
  createdAt: true,
  updatedAt: true,
};

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    @Inject(forwardRef(() => AuthService)) private authService: AuthService,
  ) {}

  async create(data: CreateUserDto): Promise<Omit<User, 'password'>> {
    try {
      const user = new UseModel(data);
      const createdUser = await this.prisma.user.create({
        data: {
          ...user,
          password: await this.authService.hashData(user.password),
        },
      });
      return omit(createdUser, 'password');
    } catch (e) {
      console.log(e);
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    }
  }

  async findAll(): Promise<
    Omit<User, 'password' | 'refreshToken' | 'accessToken'>[]
  > {
    return this.prisma.user.findMany({ select: USER_SELECT_FIELDS });
  }

  async findOne(
    id: string,
  ): Promise<Omit<User, 'password' | 'refreshToken' | 'accessToken'> | null> {
    if (!HelpersService.isValidateUUID(id)) {
      throw new HttpException('Forbidden', HttpStatus.BAD_REQUEST);
    }
    const fondUser = await this.prisma.user.findUnique({
      where: { id },
      select: USER_SELECT_FIELDS,
    });
    if (!fondUser) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
    return fondUser;
  }

  async findOneByLogin(login: string): Promise<User | null> {
    return await this.prisma.user.findFirst({
      where: {
        login: {
          equals: login,
        },
      },
    });
  }

  async update(
    id: string,
    updateUserDto: UpdateUserPasswordDto,
  ): Promise<Omit<User, 'password'>> {
    if (!HelpersService.isValidateUUID(id)) {
      throw new HttpException('Forbidden', HttpStatus.BAD_REQUEST);
    }
    if (Reflect.ownKeys(updateUserDto).length === 0) {
      throw new HttpException('Forbidden', HttpStatus.BAD_REQUEST);
    }
    const foundUser = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!foundUser) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
    try {
      const passwordMatches = await argon2.verify(
        foundUser.password,
        updateUserDto.oldPassword,
      );
      if (!passwordMatches) {
        throw new ForbiddenException('Wrong password');
      }
    } catch (e) {
      console.error(e);
      throw new ForbiddenException('Wrong password');
    }

    foundUser.password = await this.authService.hashData(
      updateUserDto.newPassword,
    );
    foundUser.updatedAt = Date.now();
    foundUser.version += 1;
    const updatedUser = await this.prisma.user.update({
      data: foundUser,
      where: { id },
    });

    return omit(updatedUser, 'password');
  }

  async updateRefreshToken(
    id: string,
    updateUserDto: UpdateUserPasswordDto,
  ): Promise<Omit<User, 'password'>> {
    const foundUser = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!foundUser) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
    foundUser.refreshToken = updateUserDto.refreshToken;
    foundUser.updatedAt = Date.now();
    foundUser.version += 1;
    const updatedUser = await this.prisma.user.update({
      data: foundUser,
      where: { id },
    });

    return omit(updatedUser, 'password');
  }

  async updateAccessToken(
    id: string,
    updateUserDto: UpdateUserPasswordDto,
  ): Promise<Omit<User, 'password'>> {
    const foundUser = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!foundUser) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
    foundUser.accessToken = updateUserDto.accessToken;
    foundUser.updatedAt = Date.now();
    foundUser.version += 1;
    const updatedUser = await this.prisma.user.update({
      data: foundUser,
      where: { id },
    });

    return omit(updatedUser, 'password');
  }

  async remove(id: string): Promise<User> {
    const foundUser = await this.findOne(id);
    if (!foundUser) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
    return this.prisma.user.delete({
      where: { id },
    });
  }
}
