import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { Artist } from './entities/artist.entity';
import { DataBaseService } from '../data-base/data-base.service';
import { HelpersService } from '../helpers/helpers.service';
import { TrackService } from '../track/track.service';
import { AlbumService } from '../album/album.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ArtistService {
  constructor(
    private prisma: PrismaService,
  ) {}
  // create(createArtistDto: CreateArtistDto) {
  //   return HelpersService.createDbRecord(
  //     Artist,
  //     this.db,
  //     'artists',
  //     createArtistDto,
  //   );
  // }

  async create(createArtistDto: CreateArtistDto) {
    try {
      const classInstance = new Artist(createArtistDto);
      const createdDbRecord = await this.prisma.artist.create({
        data: {...classInstance },
      });
      return createdDbRecord;
    } catch (e) {
      console.log(e);
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    }
  }

  // findAll(): Artist[] {
  //   return Array.from(this.db.artists.values());
  // }

  async findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }): Promise<Artist[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return await this.prisma.artist.findMany();
  }

  // async findOne(id: Artist['id']): Promise<Artist> {
  //   const foundData = await this.db.artists.get(id);
  //   if (!foundData) {
  //     throw new HttpException('Not found', HttpStatus.NOT_FOUND);
  //   }
  //   return foundData;
  // }

  async findOne(
    id: Artist['id']
  ): Promise<Artist | null> {
    if (!HelpersService.isValidateUUID(id)) {
      throw new HttpException('Forbidden', HttpStatus.BAD_REQUEST);
    }
    const doundDbRecord = await this.prisma.artist.findUnique({
      where: {id},
    });
    if (!doundDbRecord) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
    return doundDbRecord;
  }

  // async update(id: Artist['id'], updateArtistDto: UpdateArtistDto) {
  //   const foundData = await this.findOne(id);
  //   if (!foundData) {
  //     throw new HttpException('Not found', HttpStatus.NOT_FOUND);
  //   }
  //   const updatedData = HelpersService.updateData(
  //     foundData,
  //     updateArtistDto,
  //     id,
  //   );
  //   this.db.artists.set(id, updatedData);
  //   return updatedData;
  // }

  async update(
    id: Artist['id'],
    updateArtistDto: UpdateArtistDto,
  ): Promise<Artist> {
    const foundDbRecord = await this.prisma.artist.findUnique({
      where: {id},
    });
    if (!foundDbRecord) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
    const updatedData = HelpersService.updateData(
      foundDbRecord,
      updateArtistDto,
      id,
    );
    const updatedDbRecord =  await this.prisma.artist.update({
      data: updatedData,
      where: {id},
    });
    return updatedDbRecord;
  }

  // async remove(id: Artist['id']) {
  //   const foundData = await this.findOne(id);
  //   if (!foundData) {
  //     throw new HttpException('Not found', HttpStatus.NOT_FOUND);
  //   }
  //   const foundTrack = await this.db.findOneByParam<string>(
  //     'artistId',
  //     foundData.id,
  //     'tracks',
  //   );
  //   if (foundTrack) {
  //     await this.trackService.update(foundTrack.id, { artistId: null });
  //   }
  //   const foundAlbum = await this.db.findOneByParam<string>(
  //     'artistId',
  //     foundData.id,
  //     'albums',
  //   );
  //   if (foundAlbum) {
  //     await this.albumService.update(foundAlbum.id, { artistId: null });
  //   }
  //   const foundFavorite = await this.db.favorites.artists.get(id);
  //   if (foundFavorite) {
  //     this.db.favorites.artists.delete(id);
  //   }
  //   this.db.artists.delete(id);
  // }

  async remove(id: Artist['id']):Promise<void> {
    const foundArtistRecord = await this.findOne(id);
    if (!foundArtistRecord) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
    const foundTrack = await this.prisma.track.findFirst({
      where: { artistId: {
        equals: foundArtistRecord.id,
      }},
    })
    // if (foundTrack) {
    //   await this.trackService.update(foundTrack.id, { artistId: null });
    // }
    //     const foundAlbum = await this.prisma.album.findFirst
    //     (
    //       {
    //         where: { artistId: {
    //           equals: foundArtistRecord.id,
    //         }},
    //       }
    // );
  //   if (foundAlbum) {
  //     await this.albumService.update(foundAlbum.id, { artistId: null });
  //   }
  //:TODO иправить поиск в favorites
    // const foundFavorite = await this.db.favorites.artists.get(id);
    // if (foundFavorite) {
    //   this.db.favorites.artists.delete(id);
    // }
    await  this.prisma.artist.delete({
      where: {id},
    });
  }
}
