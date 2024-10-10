import { DeepPartial, QueryRunner, ObjectLiteral, Repository } from 'typeorm';
import { DatabaseException } from '../exceptions/database.exception';

export interface IAbstractRepository<Entity extends ObjectLiteral> {
  save(data: DeepPartial<Entity>, qr?: QueryRunner): Promise<Entity>;

  saveMany(data: DeepPartial<Entity>[], qr?: QueryRunner): Promise<Entity[]>;
}

export abstract class AbstractRepository<Entity extends ObjectLiteral>
  implements IAbstractRepository<Entity>
{
  constructor(protected readonly repository: Repository<Entity>) {}
  async save(data: DeepPartial<Entity>): Promise<Entity> {
    try {
      return await this.repository.save(data, { reload: true });
    } catch (error) {
      throw new DatabaseException(error.message, error);
    }
  }

  async saveMany(data: DeepPartial<Entity>[]): Promise<Entity[]> {
    try {
      return await this.repository.save(data);
    } catch (error) {
      throw new DatabaseException(error.message, error);
    }
  }
}
