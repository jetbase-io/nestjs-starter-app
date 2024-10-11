import { IUserRepository } from 'src/modules/users/repository/user-repository.type';

export interface IDbContext {
  userRepository: IUserRepository;

  startTransaction(): Promise<void>;

  commitTransaction(): Promise<void>;

  rollbackTransaction(): Promise<void>;
}
