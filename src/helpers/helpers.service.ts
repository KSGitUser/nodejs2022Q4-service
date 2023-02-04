import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  version as uuidVersion,
  v4 as crateV4uuid,
  validate as uuidValidate,
} from 'uuid';
import { DataBaseService } from '../data-base/data-base.service';
import { IHasId, Instantiable } from './types';
import { merge, keys, pick } from 'lodash/fp';

@Injectable()
export class HelpersService {
  static createUUID(): string {
    return crateV4uuid();
  }

  static isValidateUUID(uuidId: string): boolean {
    return uuidValidate(uuidId) && uuidVersion(uuidId) === 4;
  }

  static updateData(target, source, id) {
    const pickedData = pick(keys(target), source);
    const mergedData = merge(target, pickedData);
    mergedData.id = id;
    return mergedData;
  }

  /**
   *
   * @param dataClass - class to create instance
   * @param dataBaseInstance - DB service to add data
   * @param dbname - name of DB instance to add data
   * @param dtoData - data
   */
  static async createDbRecord<C extends IHasId, O>(
    dataClass: Instantiable<C>,
    dataBaseInstance: DataBaseService,
    dbname: string,
    dtoData: O,
  ): Promise<C> {
    try {
      const classInstance: C = new dataClass(dtoData);
      await dataBaseInstance[dbname].set(classInstance.id, classInstance);
      return classInstance;
    } catch (e) {
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    }
  }
}
