import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { DataBaseService } from '../data-base/data-base.service';
import { Track } from './entities/track.entity';
import { merge } from 'lodash/fp';
import { UpdateTrackDto } from './dto/update-track.dto';

@Injectable()
export class TrackService {
  constructor(private db: DataBaseService) {}

  create(createTrackDto: CreateTrackDto) {
    try {
      let foundArtist;
      if (createTrackDto.artistId) {
        foundArtist = this.db.findOneByParam<string>(
          'id',
          createTrackDto.artistId,
          'artists',
        );
        if (!foundArtist.id) {
          createTrackDto.artistId = null;
        }
      }
      const createdTrack = new Track(createTrackDto);
      this.db.tracks.set(createdTrack.id, createdTrack);
      return createdTrack;
    } catch (e) {
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    }
  }

  findAll(): Track[] {
    return Array.from(this.db.tracks.values());
  }

  async findOne(id: string): Promise<Track> {
    const fondTrack = await this.db.tracks.get(id);
    if (!fondTrack) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
    return fondTrack;
  }

  async update(
    id: string,
    updateTrackDto: UpdateTrackDto,
  ): Promise<Omit<Track, 'password'>> {
    const foundTrack = await this.findOne(id);
    if (!foundTrack) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
    const updatedData = merge(foundTrack, updateTrackDto);
    this.db.artists.set(id, updatedData);
    return updatedData;
  }

  async remove(id: string): Promise<void> {
    const foundTrack = await this.findOne(id);
    if (!foundTrack) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
    this.db.tracks.delete(id);
  }
}
