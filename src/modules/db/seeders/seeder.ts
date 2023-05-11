import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/modules/users/users.service';
import { users } from './data/users';

@Injectable()
export class Seeder {
  constructor(private readonly userService: UsersService) {}
  async seed() {
    for await (const iterator of users) {
      await this.userService
        .createBySeed(iterator)
        .then((completed) => {
          Promise.resolve(completed);
        })
        .catch((error) => {
          Promise.reject(error);
        });
    }
  }
}
