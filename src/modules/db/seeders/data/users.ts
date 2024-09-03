import { Role } from '../../../roles/enums/role.enum';
import { CreateUserBySeedDto } from 'src/modules/users/dto/create-user-by-seed.dto';

export const users: CreateUserBySeedDto[] = [
  {
    username: 'testUser',
    email: 'testuser@mail.com',
    password: '$2a$10$XVzLRzZbXQZMiulFJMFew.OSrvfc6SPeF7z/9.bLtm.YW0evvJRUK',
    role: Role.USER,
    confirmedAt: new Date(),
  },
  {
    username: 'testAdmin',
    email: 'testadmin@mail.com',
    password: '$2a$10$2eScVeEE/FfIjgcttvDWyukmNcGgoTC78fqAyiAXrtyw.Dz7QVMui',
    role: Role.ADMIN,
    confirmedAt: new Date(),
  },
];
