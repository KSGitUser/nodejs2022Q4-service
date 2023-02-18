import { CreateUserDto } from '../dto/create-user.dto';
import { HelpersService } from '../../helpers/helpers.service';
import { Prisma } from '@prisma/client';

export class User {
  static readonly initialVersion = 1;

  id: string;
  login: string;
  password: string;
  version: number;
  createdAt: number;
  updatedAt: number;

  constructor(createUserDTO: Partial<Prisma.UserCreateInput>) {
    this.id = HelpersService.createUUID();
    this.login = createUserDTO.login;
    this.password = createUserDTO.password;
    this.version = User.initialVersion;
    this.createdAt = Date.now();
    this.updatedAt = Date.now();

    Object.defineProperty(this, 'password', {
      enumerable: false,
    });
  }

  // set createdAt(value: Date | string) {
  //   this.#createdAt = !!value ? new Date(value) : new Date();
  // }

  // get createdAt():string {
  //   return (this.#createdAt || new Date()).getTime() + '';
  // }

  // set updatedAt(value: Date | string) {
  //   this.#updatedAt =  !!value ? new Date(value) : new Date();
  // }

  // get updatedAt():string {
  //   return (this.#updatedAt || new Date()).getTime() + '';
  // }

  // get createdAtDate():Date {
  //   return new Date(this.#createdAt)
  // }

  // get updatedAtDate():Date {
  //   return new Date(this.#updatedAt)
  // }

}
