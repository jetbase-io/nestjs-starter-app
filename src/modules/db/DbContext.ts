import { Injectable } from '@nestjs/common';
import { IDbContext } from 'src/common/types/db-context.type';
import {
  type EntityTarget,
  type ObjectLiteral,
  type EntityManager,
  Connection,
} from 'typeorm';
import { IUserRepository } from '../users/repository/user-repository.type';
import { UserEntity } from '../users/models/users.entity';
import { UsersRepository } from '../users/repository/users.repository';
import { InjectConnection } from '@nestjs/typeorm';

@Injectable()
export class DbContext implements IDbContext {
  private _userRepository: IUserRepository;

  private _manager: EntityManager;

  constructor(@InjectConnection() private connection: Connection) {
    this._manager = connection.manager;

    this.initRepositories();
  }

  private getRepository<
    TEntity extends EntityTarget<ObjectLiteral>,
    TRepository,
  >(ctor: new (...args: any[]) => TRepository, entity: TEntity): TRepository {
    return new ctor(this._manager.getRepository(entity));
  }

  private initRepositories(): void {
    this._userRepository = this.getRepository(UsersRepository, UserEntity);
  }

  get userRepository(): IUserRepository {
    return this._userRepository;
  }

  async startTransaction(): Promise<void> {
    this._manager = this.connection.manager;

    this.initRepositories();

    await this._manager.queryRunner!.startTransaction();
  }

  async commitTransaction(): Promise<void> {
    if (this._manager.queryRunner) {
      await this._manager.queryRunner.commitTransaction();

      await this._manager.queryRunner.release();
    }
  }

  async rollbackTransaction(): Promise<void> {
    if (this._manager.queryRunner) {
      await this._manager.queryRunner.rollbackTransaction();

      await this._manager.queryRunner.release();
    }
  }
}
