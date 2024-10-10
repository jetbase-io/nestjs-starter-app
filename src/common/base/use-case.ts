import { Inject } from '@nestjs/common';
import { BaseToken } from '../enums/diTokens';
import { IDbContext } from '../types/db-context.type';

export abstract class UseCase<TInput = void, TOutput = void> {
  protected _input: TInput;

  @Inject(BaseToken.DB_CONTEXT)
  protected _dbContext: IDbContext;

  async execute(input: TInput): Promise<TOutput> {
    this._input = input;

    let result: TOutput;

    try {
      result = await this.implementation();
    } catch (error) {
      throw error;
    }

    return result;
  }

  protected abstract implementation(): Promise<TOutput> | TOutput;
}
