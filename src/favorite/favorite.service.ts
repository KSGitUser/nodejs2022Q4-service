import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

const favoriteId = '99999999-14b8-4b41-80c1-49a5c82d7538';

const DB_CATEGORY_NAMES = {
  album: 'albums',
  track: 'tracks',
  artist: 'artists',
};

@Injectable()
export class FavoriteService {
  constructor(private prisma: PrismaService) {}
  async create(categoryName: string, id: string) {
    if (!DB_CATEGORY_NAMES[categoryName]) {
      return new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    }
    const foundData = await this.prisma[categoryName].findUnique({
      where: { id },
    });
    if (!foundData) {
      throw new HttpException(
        'Not found entity',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    const foundFavorite = this.prisma.favorite.findUnique({
      where: { id: favoriteId },
    });

    if (!foundFavorite) {
      return await this.prisma.favorite.create({
        data: {
          id: favoriteId,
          [DB_CATEGORY_NAMES[categoryName]]: {
            connect: { id: id },
          },
        },
      });
    }
    return await this.prisma.favorite.update({
      where: { id: favoriteId },
      data: {
        [DB_CATEGORY_NAMES[categoryName]]: {
          connect: { id: id },
        },
      },
    });
  }

  async findAll() {
    return await this.prisma.favorite.findUnique({
      where: { id: favoriteId },
      include: {
        artists: true,
        tracks: true,
        albums: true,
      },
    });
  }

  async remove(categoryName: string, id: string) {
    if (!DB_CATEGORY_NAMES[categoryName]) {
      return new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    }
    return await this.prisma.favorite.update({
      where: { id: favoriteId },
      data: {
        [DB_CATEGORY_NAMES[categoryName]]: {
          disconnect: { id: id },
        },
      },
    });
  }
}
