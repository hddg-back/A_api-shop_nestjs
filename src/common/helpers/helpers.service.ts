import { Injectable } from '@nestjs/common';

@Injectable()
export class HelpersService {
  static removeSpecialCharacters(str: string): string {
    str = str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    return str.replace(/[^a-zA-Z0-9 ]/g, '');
  }
}
