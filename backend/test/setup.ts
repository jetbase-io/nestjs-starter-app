import { getConnection } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { CreateRoleDto } from '../src/modules/roles/dto/create-role.dto';
import { CreateUserByRoleDto } from '../src/modules/users/dto/create-user-by-role.dto';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { useContainer } from 'class-validator';
import { INestApplication, Logger } from '@nestjs/common';
import { UsersService } from '../src/modules/users/users.service';
import { RolesService } from '../src/modules/roles/roles.service';
import { UserEntity } from '../src/modules/users/models/users.entity';

let app: INestApplication;
let moduleFixture: TestingModule;

// global.beforeEach(async () => {
//   moduleFixture = await Test.createTestingModule({
//     imports: [AppModule],
//   }).compile();
//   app = moduleFixture.createNestApplication();
//   useContainer(app.select(AppModule), { fallbackOnErrors: true });
//   await app.init();
//   await clearDB();
//   await seed();
// });

// afterEach(async () => {
//   await app.close();
// });

export async function clearDB(app: INestApplication) {
  const entities = getConnection().entityMetadatas;
  for (const entity of entities) {
    const repository = await getConnection().getRepository(entity.name);
    await repository.query(
      `TRUNCATE ${entity.tableName} RESTART IDENTITY CASCADE;`,
    );
  }
}

const roles = [
  { id: 1, value: 'ADMIN' },
  { id: 0, value: 'USER' },
];

const users = [
  {
    id: 1,
    username: 'testuser@gmail.com',
    password: 'user123',
  },
  {
    id: 2,
    username: 'testadmin@gmail.com',
    password: 'admin123',
  },
];

export async function seed() {
  const hashedPassword = await bcrypt.hash('user123', 10);
  const userEntity = await getConnection().getRepository('RoleEntity').create({
    id: 1,
    username: 'testuser@gmail.com',
    password: hashedPassword,
  });

  const refreshToken = {
    id: 1,
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWU',
  };
  await getConnection().getRepository('RoleEntity').insert(roles);
  await getConnection()
    .getRepository('RefreshTokenEntity')
    .insert(refreshToken);
  for (let i = 0; i < users.length; i++) {
    users[i].password = await bcrypt.hash(users[i].password, 10);
    await getConnection().getRepository('UserEntity').insert(users[i]);
  }
}
