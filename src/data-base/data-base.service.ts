import { Injectable } from '@nestjs/common';
import { User } from '../user/entities/user.entity';
import { Artist } from '../artist/entities/artist.entity';
import { Track } from '../track/entities/track.entity';
import { Album } from '../album/entities/album.entity';
import { keys } from 'lodash/fp';

@Injectable()
export class DataBaseService {
  users: Map<string, User>;
  artists: Map<string, Artist>;
  tracks: Map<string, Track>;
  albums: Map<string, Album>;
  favorites: {
    artists: Map<string, string>;
    albums: Map<string, string>;
    tracks: Map<string, string>;
  };

  constructor() {
    this.users = new Map();
    this.artists = new Map();
    this.tracks = new Map();
    this.albums = new Map();
    this.favorites = {
      artists: new Map(),
      albums: new Map(),
      tracks: new Map(),
    };
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

  findManyByIds(ids: string[], dbInstanceName: keyof DataBaseService) {
    return this.findAll(dbInstanceName).filter((item) => {
      return ids.includes(item.id);
    });
  }

  getAllFavorites() {
    const resultObj = {};
    keys(this.favorites).forEach((key) => {
      const ids: string[] = Array.from(this.favorites[key].values());
      resultObj[key] = this.findManyByIds(ids, key as keyof DataBaseService);
    });

    return resultObj;
  }
}
