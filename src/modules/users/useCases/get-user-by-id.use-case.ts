import { UseCase } from 'src/common/base/use-case';
import { Injectable } from '@nestjs/common';
import { UserModel } from '../models/users.model';
import { UserNotFoundAppException } from 'src/common/base/exceptions/user/user-not-found.exception';

export interface IGetUserByIdUseCase {
  execute(inputData: string): Promise<UserModel>;
}

@Injectable()
export class GetUserByIdUseCase
  extends UseCase<string, UserModel>
  implements IGetUserByIdUseCase
{
  protected async implementation(): Promise<UserModel> {
    const result = this._dbContext.userRepository.getOneById(this._input);

    if (!result) {
      throw new UserNotFoundAppException(this._input);
    }

    return result;
  }
}
