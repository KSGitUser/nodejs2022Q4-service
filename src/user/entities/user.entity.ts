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
}
