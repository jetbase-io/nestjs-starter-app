import { AbstractRepository } from 'src/common/base/classes/base.repository';
import { UserEntity } from '../models/users.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { Role } from '../../../common/enums/role.enum';
import { UpdateUserDto } from '../dto/update-user.dto';
import { OrderDirection } from '../../admin/dto/pagination-params.dto';
import {
  Connection,
  DeepPartial,
  getRepository,
  Repository,
  UpdateResult,
} from 'typeorm';
import { InjectConnection } from '@nestjs/typeorm';

export class UsersRepositoryBC {
  protected repository: Repository<UserEntity>;

  constructor(
    @InjectConnection()
    protected readonly connection: Connection,
  ) {
    this.repository = connection.getRepository(UserEntity);
  }

  async createUser(
    createUserDto: CreateUserDto,
    role: Role,
    hashedPassword: string,
    confirmedAt?: Date,
  ): Promise<UserEntity> {
    const newUserBbid = this.repository.create({
      username: createUserDto.username,
      password: hashedPassword,
      email: createUserDto.email,
      roles: role,
      confirmationToken: createUserDto.confirmationToken,
      confirmedAt: confirmedAt,
    });
    return await this.repository.save(newUserBbid);
  }

  async save(data: DeepPartial<UserEntity>): Promise<UserEntity> {
    return await this.repository.save(data, { reload: true });
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

  async getOneById(id: string): Promise<UserEntity> {
    const user = await this.repository.findOne({ id });

    return user;
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

  async updateUserAvatarById(
    id: string,
    avatarLocation: string,
  ): Promise<UpdateResult> {
    const result = await this.repository
      .createQueryBuilder()
      .update({
        avatar: avatarLocation,
      })
      .where({
        id,
      })
      .returning(['username', 'avatar'])
      .execute();

    return result;
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

  getRepository() {
    return getRepository(UserEntity);
  }
}
