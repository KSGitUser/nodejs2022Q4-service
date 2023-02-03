import { CreateUserDto } from '../dto/create-user.dto';
import { HelpersService } from '../../helpers/helpers.service';

export class User {
  id: string;

  login: string;

  password: string;

  version: number;

  createdAt: number;

  updatedAt: number;
  constructor(createUserDTO: CreateUserDto) {
    this.id = HelpersService.createUUID();
    this.login = createUserDTO.login;
    this.password = createUserDTO.password;
    this.version = 1;
    this.createdAt = Date.now();
    this.updatedAt = Date.now();
  }
}
