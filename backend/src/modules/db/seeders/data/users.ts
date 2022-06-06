import { CreateUserByRoleDto } from '../../../users/dto/create-user-by-role.dto';

export const users: CreateUserByRoleDto[] = [
  {
    username: 'testuser@gmail.com',
    password: 'user123',
    role: 'USER',
  },
  {
    username: 'testadmin@gmail.com',
    password: 'admin123',
    role: 'ADMIN',
  },
];
