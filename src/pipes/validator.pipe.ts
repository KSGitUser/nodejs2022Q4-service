import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
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
