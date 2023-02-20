import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Album } from 'src/album/entities/album.entity';
import { Artist } from 'src/artist/entities/artist.entity';
import { PrismaService } from 'src/prisma/prisma.service';
import { Track } from 'src/track/entities/track.entity';
import { favoriteId } from './../helpers/consts';

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
    const foundFavorite = await this.prisma.favorite.findUnique({
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
    const foundFavorites = await this.prisma.favorite.findUnique({
      where: { id: favoriteId },
      include: {
        artists: true,
        tracks: true,
        albums: true,
      },
    });
    return { ...{ albums: [], tracks: [], artists: [] }, ...foundFavorites };
  }

  async remove(categoryName: string, id: string) {
    if (!DB_CATEGORY_NAMES[categoryName]) {
      return new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    }

    const favorite = await this.prisma.favorite.findUnique({
      where: { id: favoriteId },
      include: { [DB_CATEGORY_NAMES[categoryName]]: true },
    });
    if (
      !favorite ||
      !(
        favorite?.[DB_CATEGORY_NAMES[categoryName]] as
          | Album[]
          | Track[]
          | Artist[]
      ).some((record) => record.id === id)
    ) {
      return;
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
