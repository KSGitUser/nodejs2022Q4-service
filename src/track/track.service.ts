import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { DataBaseService } from '../data-base/data-base.service';
import { Track } from './entities/track.entity';
import { UpdateTrackDto } from './dto/update-track.dto';
import { HelpersService } from '../helpers/helpers.service';

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
      if (createTrackDto.albumId) {
        foundArtist = this.db.findOneByParam<string>(
          'id',
          createTrackDto.albumId,
          'albums',
        );
        if (!foundArtist.id) {
          createTrackDto.albumId = null;
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
    id: Track['id'],
    updateTrackDto: UpdateTrackDto,
  ): Promise<Track> {
    const foundTrack = await this.findOne(id);
    if (!foundTrack) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
    const updatedData = HelpersService.updateData(
      foundTrack,
      updateTrackDto,
      id,
    );
    this.db.tracks.set(id, { ...updatedData, id });
    return updatedData;
  }

  async remove(id: Track['id']): Promise<void> {
    const foundTrack = await this.findOne(id);
    if (!foundTrack) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
    this.db.tracks.delete(id);
  }
}
