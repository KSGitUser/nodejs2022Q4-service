import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserPasswordDto } from './dto/update-user-password.dto';
import { User } from './entities/user.entity';
import { DataBaseService } from '../data-base/data-base.service';
import { HelpersService } from '../helpers/helpers.service';
import { omit } from 'lodash';
import { ForbiddenException } from '@nestjs/common/exceptions/forbidden.exception';

@Injectable()
export class UserService {
  constructor(private db: DataBaseService) {}

  create(createUserDto: CreateUserDto) {
    try {
      const user = new User(createUserDto);
      this.db.users.set(user.id, user);
      return omit(user, 'password');
    } catch (e) {
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    }
  }

  findAll(): User[] {
    return Array.from(this.db.users.values());
  }

  async findOne(id: string): Promise<User> {
    if (!HelpersService.isValidateUUID(id)) {
      throw new HttpException('Forbidden', HttpStatus.BAD_REQUEST);
    }
    const fondUser = await this.db.users.get(id);
    if (!fondUser) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
    return fondUser;
  }

  async update(
    id: string,
    updateUserDto: UpdateUserPasswordDto,
  ): Promise<Omit<User, 'password'>> {
    const foundUser = await this.findOne(id);
    if (!foundUser) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
    if (updateUserDto.oldPassword !== foundUser.password) {
      throw new ForbiddenException('Wrong password');
    }
    const user = {
      ...foundUser,
      password: updateUserDto.newPassword,
    };
    user.updatedAt = Date.now();
    user.version += 1;
    this.db.users.set(user.id, { ...user });
    return omit(user, 'password');
  }

  async remove(id: string): Promise<void> {
    const foundUser = await this.findOne(id);
    if (!foundUser) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
    this.db.users.delete(id);
  }
}
