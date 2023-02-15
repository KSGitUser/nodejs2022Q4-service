import { CreateAlbumDto } from './create-album.dto';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class UpdateAlbumDto extends PartialType(CreateAlbumDto) {
  @ApiProperty()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  year?: number; // integer number

  @ApiProperty()
  @IsOptional()
  @IsString()
  artistId?: string | null; // refers to Artist
}
