import { HelpersService } from '../../helpers/helpers.service';
import { CreateTrackDto } from '../dto/create-track.dto';

interface ITrack {
  id: string; // uuid v4
  name: string;
  artistId: string | null; // refers to Artist
  albumId: string | null; // refers to Album
  duration: number; // integer number
}

export class Track implements ITrack {
  id: string;
  name: string;
  artistId: string | null; // refers to Artist
  albumId: string | null; // refers to Album
  duration: number; // integer number

  constructor(createTrackDto: CreateTrackDto) {
    this.id = HelpersService.createUUID();
    this.name = createTrackDto.name;
    this.artistId = createTrackDto.artistId || null;
    this.albumId = createTrackDto.albumId || null;
    this.duration = createTrackDto.duration;
  }
}
