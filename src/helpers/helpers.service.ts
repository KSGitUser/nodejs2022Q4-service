import { Injectable } from '@nestjs/common';
import {
  version as uuidVersion,
  v4 as crateV4uuid,
  validate as uuidValidate,
} from 'uuid';

@Injectable()
export class HelpersService {
  static createUUID(): string {
    return crateV4uuid();
  }

  static isValidateUUID(uuidId: string): boolean {
    return uuidValidate(uuidId) && uuidVersion(uuidId) === 4;
  }
}
