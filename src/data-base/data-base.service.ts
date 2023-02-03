import { Injectable } from '@nestjs/common';
import { User } from '../user/entities/user.entity';

@Injectable()
export class DataBaseService {
  users: Map<string, User>;
  constructor() {
    this.users = new Map();
  }
}
