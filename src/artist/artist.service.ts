import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { Artist } from './entities/artist.entity';
import { HelpersService } from '../helpers/helpers.service';
import { TrackService } from '../track/track.service';
import { AlbumService } from '../album/album.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { FavoriteService } from 'src/favorite/favorite.service';

@Injectable()
export class ArtistService {
  constructor(
    private prisma: PrismaService,
    private trackService: TrackService,
    private albumService: AlbumService,
    private favoriteService: FavoriteService,
  ) {}

  async create(createArtistDto: CreateArtistDto) {
    try {
      const classInstance = new Artist(createArtistDto);
      const createdDbRecord = await this.prisma.artist.create({
        data: { ...classInstance },
      });
      return createdDbRecord;
    } catch (e) {
      console.log(e);
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    }
  }

  async findAll(): Promise<Artist[]> {
    return await this.prisma.artist.findMany();
  }

  async findOne(id: Artist['id']): Promise<Artist | null> {
    if (!HelpersService.isValidateUUID(id)) {
      throw new HttpException('Forbidden', HttpStatus.BAD_REQUEST);
    }
    const doundDbRecord = await this.prisma.artist.findUnique({
      where: { id },
    });
    if (!doundDbRecord) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
    return doundDbRecord;
  }

  async update(
    id: Artist['id'],
    updateArtistDto: UpdateArtistDto,
  ): Promise<Artist> {
    const foundDbRecord = await this.prisma.artist.findUnique({
      where: { id },
    });
    if (!foundDbRecord) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
    const updatedData = HelpersService.updateData(
      foundDbRecord,
      updateArtistDto,
      id,
    );
    const updatedDbRecord = await this.prisma.artist.update({
      data: updatedData,
      where: { id },
    });
    return updatedDbRecord;
  }

  async remove(id: Artist['id']): Promise<void> {
    const foundArtistRecord = await this.findOne(id);
    if (!foundArtistRecord) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
    const foundTrack = await this.prisma.track.findFirst({
      where: {
        artistId: {
          equals: foundArtistRecord.id,
        },
      },
    });
    if (foundTrack) {
      await this.trackService.update(foundTrack.id, { artistId: null });
    }
    const foundAlbum = await this.prisma.album.findFirst({
      where: {
        artistId: {
          equals: foundArtistRecord.id,
        },
      },
    });
    if (foundAlbum) {
      await this.albumService.update(foundAlbum.id, { artistId: null });
    }

    await this.favoriteService.remove('artist', id);

    await this.prisma.artist.delete({
      where: { id },
    });
  }
}
