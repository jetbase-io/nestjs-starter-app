import { UseCase } from 'src/common/base/use-case';
import { CreateUserDto } from '../dto/create-user.dto';
import { Role } from 'src/common/enums/role.enum';
import { Inject, Injectable } from '@nestjs/common';
import { ServiceToken } from 'src/common/enums/diTokens';
import { IBcryptService } from 'src/common/types/bcrypt.type';
import { UserModel } from '../models/users.model';

export interface ICreateUserUseCase {
  execute(inputData: CreateUserDto): Promise<UserModel>;
}

@Injectable()
export class CreateUserUseCase
  extends UseCase<CreateUserDto, UserModel>
  implements ICreateUserUseCase
{
  protected readonly _userRole = Role.USER;

  constructor(
    @Inject(ServiceToken.BCRYPT_SERVICE)
    protected readonly _bcryptService: IBcryptService,
  ) {
    super();
  }

  protected async implementation(): Promise<UserModel> {
    const { password } = this._input;

    const hashedPassword = await this._bcryptService.hash(password);

    const result = this._dbContext.userRepository.createUser(
      this._input,
      this._userRole,
      hashedPassword,
    );

    return result;
  }
}
