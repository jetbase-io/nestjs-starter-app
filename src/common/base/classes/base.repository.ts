import { ObjectLiteral, Repository } from 'typeorm';

export abstract class AbstractRepository<Entity extends ObjectLiteral> {
  constructor(protected readonly repository: Repository<Entity>) {}
}
