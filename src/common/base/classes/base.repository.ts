import {
  DeepPartial,
  QueryRunner,
  ObjectLiteral,
  EntityTarget,
  Repository,
  getRepository,
} from 'typeorm';
import { DatabaseException } from '../exceptions/database.exception';

export interface IAbstractRepository<Entity extends ObjectLiteral> {
  save(data: DeepPartial<Entity>, qr?: QueryRunner): Promise<Entity>;

  saveMany(data: DeepPartial<Entity>[], qr?: QueryRunner): Promise<Entity[]>;
  getRepository(qr?: QueryRunner): Repository<Entity>;
}

export abstract class AbstractRepository<Entity extends ObjectLiteral>
  implements IAbstractRepository<Entity>
{
  constructor(private readonly ref: EntityTarget<Entity>) {}
  async save(data: DeepPartial<Entity>, qr?: QueryRunner): Promise<Entity> {
    try {
      const repo = this.getRepository(qr);

      return await repo.save(data, { reload: true });
    } catch (error) {
      throw new DatabaseException(error.message, error);
    }
  }

  async saveMany(
    data: DeepPartial<Entity>[],
    qr?: QueryRunner,
  ): Promise<Entity[]> {
    try {
      const repo = this.getRepository(qr);

      return await repo.save(data);
    } catch (error) {
      throw new DatabaseException(error.message, error);
    }
  }

  getRepository(qr?: QueryRunner) {
    if (qr) {
      return qr.manager.getRepository(this.ref);
    }
    return getRepository(this.ref);
  }
}
