import { AbstractRepository } from 'src/common/base/classes/base.repository';
import { UserEntity } from '../models/users.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { Role } from '../../../common/enums/role.enum';
import { UpdateUserDto } from '../dto/update-user.dto';
import { OrderDirection } from '../../admin/dto/pagination-params.dto';
import { IUserRepository } from './user-repository.type';
import { UsersMapper } from '../models/users.mapper';
import { UserModel } from '../models/users.model';

export class UsersRepository
  extends AbstractRepository<UserEntity>
  implements IUserRepository
{
  async save(data: UserModel): Promise<UserModel> {
    const userEntity = UsersMapper.toEntity(data);

    const createdUser = await this.repository.save(userEntity);

    return UsersMapper.toDto(createdUser);
  }

  async createUser(
    createUserDto: CreateUserDto,
    role: Role,
    hashedPassword: string,
    confirmedAt?: Date,
  ): Promise<UserModel> {
    const newUserBbid = this.repository.create({
      username: createUserDto.username,
      password: hashedPassword,
      email: createUserDto.email,
      roles: role,
      confirmationToken: createUserDto.confirmationToken,
      confirmedAt: confirmedAt,
    });
    const user = await this.repository.save(newUserBbid);

    return UsersMapper.toDto(user);
  }

  async getMany(
    skip: number,
    take: number,
    sort: string,
    order: OrderDirection,
  ): Promise<[UserEntity[], number]> {
    const data = await this.repository
      .createQueryBuilder('users')
      .take(take)
      .skip(skip)
      .orderBy(sort, order)
      .getManyAndCount();

    return data;
  }

  async getOneById(id: string): Promise<UserModel> {
    const user = await this.repository.findOne({ id });

    return UsersMapper.toDto(user);
  }

  async getOneByName(username: string): Promise<UserEntity> {
    return await this.repository.findOne({
      where: { username: username },
    });
  }

  async getOneByConfirmationToken(
    confirmationToken: string,
  ): Promise<UserEntity> {
    return await this.repository.findOne({
      where: { confirmationToken },
    });
  }

  async updateById(id: string, update: UpdateUserDto): Promise<void> {
    await this.repository.update(id, update);
  }

  async updatePassword(
    userId: string,
    hashedNewPassword: string,
  ): Promise<void> {
    await this.repository.update(userId, { password: hashedNewPassword });
  }

  async deleteMany(ids: string[]): Promise<void> {
    await this.repository.delete(ids);
  }

  async deleteOne(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async updateUserStripeInfo(
    userId: string,
    customerId: string,
    subscriptionId: string,
  ) {
    await this.repository.update(userId, {
      customerStripeId: customerId,
      subscriptionId,
    });
  }
}
