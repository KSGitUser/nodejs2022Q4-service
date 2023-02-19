import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { DataBaseService } from '../data-base/data-base.service';
import { Album } from './entities/album.entity';
import { TrackService } from '../track/track.service';
import { HelpersService } from '../helpers/helpers.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { favoriteId } from 'src/helpers/consts';

@Injectable()
export class AlbumService {
  constructor(
    private prisma: PrismaService,
    private db: DataBaseService,
    private trackService: TrackService,
  ) {}

  async create(createAlbumDto: CreateAlbumDto) {
    try {
      let foundArtist;
      if (createAlbumDto.artistId) {
        foundArtist = await this.prisma.artist.findUnique({where: {
          id: createAlbumDto.artistId
        }
      });
      if (!foundArtist?.id) {
          createAlbumDto.artistId = null;
        }
      }
      const createdAlbum = new Album(createAlbumDto);
      const createdDbRecord = await this.prisma.album.create({
        data: {...createdAlbum },
      });;
      return createdDbRecord;
    } catch (e) {
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    }
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }): Promise<Album[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return await this.prisma.album.findMany();
  }

  async findOne(id: Album['id']): Promise<Album> {
    const fondAlbum = await this.prisma.album.findUnique({where: {id}});
    if (!fondAlbum) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
    return fondAlbum;
  }

  async update(
    id: Album['id'],
    updateAlbumDto: UpdateAlbumDto,
  ): Promise<Album> {
    const foundAlbum = await this.findOne(id);
    if (!foundAlbum) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
    if (updateAlbumDto.artistId) {
      const foundArtist = await this.prisma.artist.findUnique({where: {
        id: updateAlbumDto.artistId
      }
    });
    if (!foundArtist?.id) {
      updateAlbumDto.artistId = null;
      }
    }
    const updatedData = HelpersService.updateData(
      foundAlbum,
      updateAlbumDto,
      id,
    );
    const updatedDbRecord = this.prisma.album.update({ where: {id}, data: updatedData});
    return updatedDbRecord;
  }

  async remove(id: Album['id']): Promise<void> {
    const foundData = await this.findOne(id);
    if (!foundData) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
    const foundTrack = await this.prisma.track.findFirst({
      where: {
        albumId: {
          equals: foundData.id
        }
      }
    });
    if (foundTrack) {
      await this.trackService.update(foundTrack.id, { albumId: null });
    }
    await this.prisma.favorite.update({
      where: { id: favoriteId },
      data: {
        tracks: {
          disconnect: { id: id },
        },
      },
    });
    await this.prisma.album.delete({ where: {id}});
  }
}
