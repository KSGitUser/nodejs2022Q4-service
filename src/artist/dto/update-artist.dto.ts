import { CreateArtistDto } from './create-artist.dto';
import { IsBoolean, IsString } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class UpdateArtistDto extends PartialType(CreateArtistDto) {
  @ApiProperty()
  @IsString()
  name?: string;

  @ApiProperty()
  @IsBoolean()
  grammy?: boolean;
}
