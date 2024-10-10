import { UseCase } from 'src/common/base/use-case';
import { Inject, Injectable } from '@nestjs/common';
import { ServiceToken } from 'src/common/enums/diTokens';
import { IBcryptService } from 'src/common/types/bcrypt.type';
import { UserModel } from '../models/users.model';
import { CreateUserByRoleDto } from '../dto/create-user-by-role.dto';

export interface ICreateUserByRoleUseCase {
  execute(inputData: CreateUserByRoleDto): Promise<UserModel>;
}

@Injectable()
export class CreateUserByRoleUseCase
  extends UseCase<CreateUserByRoleDto, UserModel>
  implements ICreateUserByRoleUseCase
{
  constructor(
    @Inject(ServiceToken.BCRYPT_SERVICE)
    protected readonly _bcryptService: IBcryptService,
  ) {
    super();
  }

  protected async implementation(): Promise<UserModel> {
    const { password, role, confirmedAt } = this._input;

    const hashedPassword = await this._bcryptService.hash(password);

    const result = this._dbContext.userRepository.createUser(
      this._input,
      role,
      hashedPassword,
      confirmedAt,
    );

    return result;
  }
}
