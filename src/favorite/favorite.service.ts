import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DataBaseService } from '../data-base/data-base.service';

const DB_CATEGORY_NAMES = {
  album: 'albums',
  track: 'tracks',
  artist: 'artists',
};

@Injectable()
export class FavoriteService {
  constructor(private db: DataBaseService) {}
  async create(categoryName: string, id: string) {
    if (!this.db.favorites[DB_CATEGORY_NAMES[categoryName]]) {
      return new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    }
    const foundData = await this.db[DB_CATEGORY_NAMES[categoryName]].get(id);
    if (!foundData) {
      throw new HttpException(
        'Not found entity',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    try {
      await this.db.favorites[DB_CATEGORY_NAMES[categoryName]].set(id, id);
      return foundData;
    } catch (e) {
      return new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    }
  }

  async findAll() {
    return await this.db.getAllFavorites();
  }

  remove(categoryName: string, id: string) {
    if (!this.db.favorites[DB_CATEGORY_NAMES[categoryName]]) {
      return new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    }
    const foundInFavorites =
      this.db.favorites[DB_CATEGORY_NAMES[categoryName]].get(id);
    if (!foundInFavorites) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
    this.db.favorites[DB_CATEGORY_NAMES[categoryName]].delete(id);
  }
}
