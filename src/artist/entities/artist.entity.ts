import { CreateArtistDto } from '../dto/create-artist.dto';
import { HelpersService } from '../../helpers/helpers.service';

interface IArtist {
  id: string; // uuid v4
  name: string;
  grammy: boolean;
}

export class Artist implements IArtist {
  grammy: boolean;
  id: string;
  name: string;

  constructor(artistData: CreateArtistDto) {
    this.id = HelpersService.createUUID();
    this.grammy = artistData.grammy;
    this.name = artistData.name;
  }
}
