import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { Artist } from './entities/artist.entity';
import { DataBaseService } from '../data-base/data-base.service';
import { HelpersService } from '../helpers/helpers.service';
import { merge } from 'lodash/fp';
import { TrackService } from '../track/track.service';

@Injectable()
export class ArtistService {
  constructor(
    private db: DataBaseService,
    private trackService: TrackService,
  ) {}
  create(createArtistDto: CreateArtistDto) {
    return HelpersService.createDbRecord(
      Artist,
      this.db,
      'artists',
      createArtistDto,
    );
  }

  findAll(): Artist[] {
    return Array.from(this.db.artists.values());
  }

  async findOne(id: Artist['id']): Promise<Artist> {
    const foundData = await this.db.artists.get(id);
    if (!foundData) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
    return foundData;
  }

  async update(id: Artist['id'], updateArtistDto: UpdateArtistDto) {
    const foundData = await this.findOne(id);
    if (!foundData) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
    const updatedData = merge(foundData, updateArtistDto);
    this.db.users.set(id, updatedData);
    return updatedData;
  }

  async remove(id: Artist['id']) {
    const foundData = await this.findOne(id);
    if (!foundData) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
    const foundTrack = await this.db.findOneByParam<string>(
      'artistId',
      foundData.id,
      'tracks',
    );
    if (foundTrack) {
      await this.trackService.remove(foundTrack.id);
    }
    this.db.artists.delete(id);
  }
}
