import { ObjectLiteral, Repository } from 'typeorm';

export abstract class TypeOrmRepository<TTypeOrmEntity extends ObjectLiteral> {
  constructor(protected readonly repository: Repository<TTypeOrmEntity>) {}
}
