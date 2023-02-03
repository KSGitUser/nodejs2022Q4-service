import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { DataBaseService } from '../data-base/data-base.service';
import { HelpersService } from '../helpers/helpers.service';
import { omit } from 'lodash';

@Injectable()
export class UserService {
  constructor(private db: DataBaseService) {}

  create(createUserDto: CreateUserDto) {
    const user = new User(createUserDto);
    try {
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
    updateUserDto: UpdateUserDto,
  ): Promise<Omit<User, 'password'>> {
    const foundUser = await this.findOne(id);
    if (!foundUser) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
    const user = {
      ...foundUser,
      ...updateUserDto,
    };
    user.updatedAt = Date.now();
    user.version += 1;
    this.db.users.set(user.id, { ...user });
    return omit(user, 'password');
  }

  async remove(userId: string): Promise<void> {
    this.db.users.delete(userId);
  }
}
