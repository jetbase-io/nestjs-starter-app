import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/modules/users/users.service';
import { users } from './data/users';
import { roles } from './data/roles';
import { RolesService } from 'src/modules/roles/roles.service';

@Injectable()
export class Seeder {
  constructor(
    private readonly userService: UsersService,
    private readonly roleService: RolesService,
  ) {}
  async seed() {
    for await (const iterator of roles) {
      await this.roleService
        .create(iterator)
        .then((completed) => {
          Promise.resolve(completed);
        })
        .catch((error) => {
          Promise.reject(error);
        });
    }

    for await (const iterator of users) {
      await this.userService
        .createByRole(iterator)
        .then((completed) => {
          Promise.resolve(completed);
        })
        .catch((error) => {
          Promise.reject(error);
        });
    }
  }
}
