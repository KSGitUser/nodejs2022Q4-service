import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  ParseUUIDPipe,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { FavoriteService } from './favorite.service';
import { ValidationNameParam } from '../pipes/validator.pipe';

@Controller('favs')
export class FavoriteController {
  constructor(private readonly favoriteService: FavoriteService) {}

  @Get()
  findAll() {
    return this.favoriteService.findAll();
  }

  @Post(':categoryName/:id')
  @HttpCode(201)
  create(
    @Param('categoryName', new ValidationNameParam({ method: 'POST' }))
    categoryName: string,
    @Param(
      'id',
      new ParseUUIDPipe({
        version: '4',
        errorHttpStatusCode: HttpStatus.BAD_REQUEST,
      }),
    )
    id: string,
  ) {
    return this.favoriteService.create(categoryName, id);
  }

  @Delete(':categoryName/:id')
  @HttpCode(204)
  remove(
    @Param('categoryName', new ValidationNameParam({ method: 'POST' }))
    categoryName: string,
    @Param(
      'id',
      new ParseUUIDPipe({
        version: '4',
        errorHttpStatusCode: HttpStatus.BAD_REQUEST,
      }),
    )
    id: string,
  ) {
    return this.favoriteService.remove(categoryName, id);
  }
}
