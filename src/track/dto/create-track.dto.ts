import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTrackDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  artistId?: string | null; // refers to Artist

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  albumId?: string | null; // refers to Album

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  duration: number; // integer number
}
