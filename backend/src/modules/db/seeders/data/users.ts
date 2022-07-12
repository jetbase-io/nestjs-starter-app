import { CreateUserByRoleDto } from '../../../users/dto/create-user-by-role.dto';

export const users: CreateUserByRoleDto[] = [
  {
    username: 'testUser',
    email: 'testuser@mail.com',
    password: 'user123',
    role: 'USER',
  },
  {
    username: 'testAdmin',
    email: 'testadmin@mail.com',
    password: 'admin123',
    role: 'ADMIN',
  },
];
