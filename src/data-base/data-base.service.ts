import { Injectable } from '@nestjs/common';
import { User } from '../user/entities/user.entity';
import { Artist } from '../artist/entities/artist.entity';
import { Track } from '../track/entities/track.entity';

@Injectable()
export class DataBaseService {
  users: Map<string, User>;
  artists: Map<string, Artist>;
  tracks: Map<string, Track>;

  constructor() {
    this.users = new Map();
    this.artists = new Map();
    this.tracks = new Map();
  }

  findAll(dbInstanceName: keyof DataBaseService) {
    const instance = (
      this[dbInstanceName] as Map<string, User | Artist | Track>
    ).values();
    return Array.from(instance);
  }

  async findOneByParam<P>(
    paramName: string,
    paramValue: P,
    dbInstanceName: keyof DataBaseService,
  ): Promise<Track | Artist | User | null> {
    const allData = this.findAll(dbInstanceName);
    const foundData = allData.find((item) => {
      return item[paramName] === paramValue;
    });
    if (!foundData) {
      return null;
    }
    return foundData;
  }
}
