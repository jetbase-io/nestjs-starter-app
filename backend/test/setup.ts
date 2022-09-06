import { getConnection } from 'typeorm';
import * as bcrypt from 'bcryptjs';

export async function clearDB() {
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
  await getConnection().getRepository('RoleEntity').create({
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
