import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { Track } from './entities/track.entity';
import { UpdateTrackDto } from './dto/update-track.dto';
import { HelpersService } from '../helpers/helpers.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { FavoriteService } from 'src/favorite/favorite.service';

@Injectable()
export class TrackService {
  constructor(
    private prisma: PrismaService,
    private favoriteService: FavoriteService,
  ) {}

  async create(createTrackDto: CreateTrackDto): Promise<Track> {
    try {
      if (createTrackDto.artistId) {
        const foundArtist = await this.prisma.artist.findUnique({
          where: { id: createTrackDto.artistId },
        });
        if (!foundArtist.id) {
          createTrackDto.artistId = null;
        }
      }
      if (createTrackDto.albumId) {
        const foundAlbum = await this.prisma.album.findUnique({
          where: { id: createTrackDto.albumId },
        });
        if (!foundAlbum.id) {
          createTrackDto.albumId = null;
        }
      }
      const createdTrack = new Track(createTrackDto);
      const createdDbRecord = this.prisma.track.create({
        data: { ...createdTrack },
      });
      return createdDbRecord;
    } catch (e) {
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    }
  }

  async findAll(): Promise<Track[]> {
    return await this.prisma.track.findMany();
  }

  async findOne(id: Track['id']): Promise<Track> {
    if (!HelpersService.isValidateUUID(id)) {
      throw new HttpException('Forbidden', HttpStatus.BAD_REQUEST);
    }
    const fondTrack = await this.prisma.track.findUnique({ where: { id } });
    if (!fondTrack) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
    return fondTrack;
  }

  async update(
    id: Track['id'],
    updateTrackDto: UpdateTrackDto,
  ): Promise<Track> {
    const foundTrack = await this.findOne(id);
    if (!foundTrack) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
    if (updateTrackDto.artistId) {
      const foundArtist = await this.prisma.artist.findUnique({
        where: { id: updateTrackDto.artistId },
      });
      if (!foundArtist.id) {
        updateTrackDto.artistId = null;
      }
    }
    if (updateTrackDto.albumId) {
      const foundAlbum = await this.prisma.album.findUnique({
        where: { id: updateTrackDto.albumId },
      });
      if (!foundAlbum.id) {
        updateTrackDto.albumId = null;
      }
    }
    const updatedData = HelpersService.updateData(
      foundTrack,
      updateTrackDto,
      id,
    );
    const updatedDbRecord = this.prisma.track.update({
      where: { id },
      data: { ...updatedData, id },
    });
    return updatedDbRecord;
  }

  async remove(id: Track['id']): Promise<void> {
    const foundTrack = await this.findOne(id);
    if (!foundTrack) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
    await this.favoriteService.remove('favorite', id);

    await this.prisma.track.delete({ where: { id } });
  }
}
