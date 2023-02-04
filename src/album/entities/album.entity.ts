import { HelpersService } from '../../helpers/helpers.service';
import { CreateAlbumDto } from '../dto/create-album.dto';

interface IAlbum {
  id: string; // uuid v4
  name: string;
  year: number;
  artistId: string | null; // refers to Artist
}

export class Album implements IAlbum {
  id: string;
  name: string;
  year: number;
  artistId: string | null;

  constructor(albumData: CreateAlbumDto) {
    this.id = HelpersService.createUUID();
    this.name = albumData.name;
    this.artistId = albumData.artistId || null;
    this.year = albumData.year;
  }
}
