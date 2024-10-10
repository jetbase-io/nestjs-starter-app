import { Role } from 'src/common/enums/role.enum';
import { CreateUserDto } from '../dto/create-user.dto';
import { OrderDirection } from 'src/modules/admin/dto/pagination-params.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserModel } from '../models/users.model';

export interface IUserRepository {
  createUser(
    createUserDto: CreateUserDto,
    role: Role,
    hashedPassword: string,
    confirmedAt?: Date,
  ): Promise<UserModel>;
  getMany(
    skip: number,
    take: number,
    sort: string,
    order: OrderDirection,
  ): Promise<any>;
  getOneById(id: string): Promise<any>;
  getOneByName(username: string): Promise<any>;
  getOneByConfirmationToken(confirmationToken: string): Promise<any>;
  updateById(id: string, update: UpdateUserDto): Promise<any>;
  updateUserAvatarById(id: string, avatarLocation: string): Promise<any>;
  updatePassword(userId: string, hashedNewPassword: string): Promise<any>;
  deleteMany(ids: string[]): Promise<any>;
  deleteOne(id: string): Promise<any>;
  updateUserStripeInfo(
    userId: string,
    customerId: string,
    subscriptionId: string,
  ): Promise<any>;
}
