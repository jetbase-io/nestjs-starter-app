import { UseCase } from 'src/common/base/use-case';
import { Injectable } from '@nestjs/common';
import { UserModel } from '../models/users.model';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserNotFoundAppException } from 'src/common/base/exceptions/user/user-not-found.exception';
import { UserAlreadyExistsAppException } from 'src/common/base/exceptions/user/user-already-exists.exception';

export interface IUpdateUserNameUseCase {
  execute(data: { id: string; data: UpdateUserDto }): Promise<UserModel>;
}

@Injectable()
export class UpdateUserNameUseCase
  extends UseCase<{ id: string; data: UpdateUserDto }, UserModel>
  implements IUpdateUserNameUseCase
{
  protected async implementation(): Promise<UserModel> {
    const { id, data } = this._input;

    const currentUser = await this._dbContext.userRepository.getOneById(id);

    if (!currentUser) {
      throw new UserNotFoundAppException(id);
    }

    const existing = await this._dbContext.userRepository.getOneByName(
      data.username,
    );

    if (existing) {
      throw new UserAlreadyExistsAppException(data.username);
    }

    currentUser.changeName(data.username);

    const updatedUser = await this._dbContext.userRepository.save(currentUser);

    return updatedUser;
  }
}
