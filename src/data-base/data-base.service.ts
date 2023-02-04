import { Injectable } from '@nestjs/common';
import { User } from '../user/entities/user.entity';
import { Artist } from '../artist/entities/artist.entity';

@Injectable()
export class DataBaseService {
  users: Map<string, User>;
  artists: Map<string, Artist>;

  constructor() {
    this.users = new Map();
    this.artists = new Map();
  }
}
