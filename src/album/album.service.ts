import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { DataBaseService } from '../data-base/data-base.service';
import { Album } from './entities/album.entity';
import { TrackService } from '../track/track.service';
import { HelpersService } from '../helpers/helpers.service';

@Injectable()
export class AlbumService {
  constructor(
    private db: DataBaseService,
    private trackService: TrackService,
  ) {}

  create(createAlbumDto: CreateAlbumDto) {
    try {
      let foundArtist;
      if (createAlbumDto.artistId) {
        foundArtist = this.db.findOneByParam<string>(
          'id',
          createAlbumDto.artistId,
          'artists',
        );
        if (!foundArtist.id) {
          createAlbumDto.artistId = null;
        }
      }
      const createdAlbum = new Album(createAlbumDto);
      this.db.albums.set(createdAlbum.id, createdAlbum);
      return createdAlbum;
    } catch (e) {
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    }
  }

  findAll(): Album[] {
    return Array.from(this.db.albums.values());
  }

  async findOne(id: Album['id']): Promise<Album> {
    const fondAlbum = await this.db.albums.get(id);
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
    const updatedData = HelpersService.updateData(
      foundAlbum,
      updateAlbumDto,
      id,
    );
    this.db.albums.set(id, updatedData);
    return updatedData;
  }

  async remove(id: Album['id']): Promise<void> {
    const foundData = await this.findOne(id);
    if (!foundData) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
    const foundTrack = await this.db.findOneByParam<string>(
      'albumId',
      foundData.id,
      'tracks',
    );

    if (foundTrack) {
      await this.trackService.update(foundTrack.id, { albumId: null });
    }
    this.db.albums.delete(id);
  }
}
