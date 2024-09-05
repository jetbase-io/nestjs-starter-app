import { CreateUserByRoleDto } from 'src/modules/users/dto/create-user-by-role.dto';
import { Role } from '../../../roles/enums/role.enum';

export const users: CreateUserByRoleDto[] = [
  {
    username: 'testUser',
    email: 'testuser@mail.com',
    password: 'user123',
    role: Role.USER,
    confirmedAt: new Date(),
  },
  {
    username: 'testAdmin',
    email: 'testadmin@mail.com',
    password: 'admin123',
    role: Role.ADMIN,
    confirmedAt: new Date(),
  },
];
