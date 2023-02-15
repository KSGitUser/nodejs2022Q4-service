import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseUUIDPipe,
  HttpStatus,
  Put,
  HttpCode,
} from '@nestjs/common';
import { TrackService } from './track.service';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { ValidationPipe } from '../pipes/validator.pipe';

@Controller('track')
export class TrackController {
  constructor(private readonly TracksService: TrackService) {}

  @Post()
  create(@Body(new ValidationPipe()) createTrackDto: CreateTrackDto) {
    return this.TracksService.create(createTrackDto);
  }

  @Get()
  findAll() {
    return this.TracksService.findAll();
  }

  @Get(':id')
  findOne(
    @Param(
      'id',
      new ParseUUIDPipe({
        version: '4',
        errorHttpStatusCode: HttpStatus.BAD_REQUEST,
      }),
    )
    id: string,
  ) {
    return this.TracksService.findOne(id);
  }

  @Put(':id')
  update(
    @Param(
      'id',
      new ParseUUIDPipe({
        version: '4',
        errorHttpStatusCode: HttpStatus.BAD_REQUEST,
      }),
    )
    id: string,
    @Body(new ValidationPipe()) updateTrackDto: UpdateTrackDto,
  ) {
    return this.TracksService.update(id, updateTrackDto);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(
    @Param(
      'id',
      new ParseUUIDPipe({
        version: '4',
        errorHttpStatusCode: HttpStatus.BAD_REQUEST,
      }),
    )
    id: string,
  ) {
    return this.TracksService.remove(id);
  }
}
