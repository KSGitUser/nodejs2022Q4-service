import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';

type TOneOfType =
  | typeof String
  | typeof Boolean
  | typeof Number
  | typeof Array
  | typeof Object;

@Injectable()
export class ValidationPipe implements PipeTransform {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype as TOneOfType)) {
      return value;
    }
    const object = plainToInstance(metatype, value);
    const errors = await validate(object, { whitelist: true });
    if (errors.length > 0) {
      throw new BadRequestException('Validation failed');
    }
    return value;
  }

  private toValidate(metatype: TOneOfType): boolean {
    const types: TOneOfType[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}

@Injectable()
export class ValidationNameParam implements PipeTransform {
  method: string = '';
  private readonly _possibleValues = ['track', 'album', 'artist'];

  constructor(data: { method: 'POST' | 'DELETE' }) {
    if (data?.method) {
      this.method = data.method;
    }
  }
  transform(value: string, metadata: ArgumentMetadata) {
    const isNamesIncludesValue = this._possibleValues.includes(value);

    if (!isNamesIncludesValue) {
      throw new NotFoundException(`Cannot ${this.method} wrong path`);
    }
    return value;
  }
}
