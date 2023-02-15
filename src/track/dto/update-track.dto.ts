import { CreateTrackDto } from './create-track.dto';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateTrackDto extends PartialType(CreateTrackDto) {
  @ApiProperty()
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty()
  @IsEmpty()
  @IsString()
  artistId?: string | null; // refers to Artist

  @ApiProperty()
  @IsString()
  @IsEmpty()
  albumId?: string | null; // refers to Album

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  duration?: number; // integer number
}
