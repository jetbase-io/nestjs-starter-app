import { Injectable } from '@nestjs/common';
import { IBcryptService } from 'src/common/types/bcrypt.type';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class BcryptService implements IBcryptService {
  rounds = 10;

  async hash(hashString: string): Promise<string> {
    return await bcrypt.hash(hashString, this.rounds);
  }

  async compare(password: string, hashPassword: string): Promise<boolean> {
    return await bcrypt.compare(password, hashPassword);
  }
}
