import { AbstractRepository } from 'src/common/base/classes/base.repository';
import { UserEntity } from './models/users.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { Role } from '../roles/enums/role.enum';
import { UpdateUserDto } from './dto/update-user.dto';
import { OrderDirection } from '../admin/dto/pagination-params.dto';
import { UpdateResult } from 'typeorm';

export class UserRepository extends AbstractRepository<UserEntity> {
  constructor() {
    super(UserEntity);
  }

  async createUser(
    createUserDto: CreateUserDto,
    role: Role,
    hashedPassword: string,
  ): Promise<UserEntity> {
    const repo = this.getRepository();
    const newUserBbid = repo.create({
      username: createUserDto.username,
      password: hashedPassword,
      email: createUserDto.email,
      roles: role,
      confirmationToken: createUserDto.confirmationToken,
    });
    return await repo.save(newUserBbid);
  }

  async getMany(
    skip: number,
    take: number,
    sort: string,
    order: OrderDirection,
  ): Promise<[UserEntity[], number]> {
    const repo = this.getRepository();

    const data = await repo
      .createQueryBuilder('users')
      .take(take)
      .skip(skip)
      .orderBy(sort, order)
      .getManyAndCount();

    return data;
  }

  async getOneById(id: string): Promise<UserEntity> {
    const repo = this.getRepository();

    const user = await repo.findOne({ id });

    return user;
  }

  async getOneByName(username: string): Promise<UserEntity> {
    const repo = this.getRepository();

    return await repo.findOne({
      where: { username: username },
    });
  }

  async getOneByConfirmationToken(
    confirmationToken: string,
  ): Promise<UserEntity> {
    const repo = this.getRepository();

    return await repo.findOne({
      where: { confirmationToken },
    });
  }

  async updateById(id: string, update: UpdateUserDto): Promise<void> {
    const repo = this.getRepository();
    await repo.update(id, update);
  }

  //TODO
  //return type definition
  async updateUserAvatarById(
    id: string,
    avatarLocation: string,
  ): Promise<UpdateResult> {
    const repo = this.getRepository();
    const result = await repo
      .createQueryBuilder()
      .update({
        avatar: avatarLocation,
      })
      .where({
        id,
      })
      .returning(['username', 'avatar'])
      .execute();

    console.log('user repo| update avatar\n', result);

    return result;
  }

  async updatePassword(
    userId: string,
    hashedNewPassword: string,
  ): Promise<void> {
    const repo = this.getRepository();
    await repo.update(userId, { password: hashedNewPassword });
  }

  async deleteMany(ids: string[]): Promise<void> {
    const repo = this.getRepository();
    await repo.delete(ids);
  }

  async deleteOne(id: string): Promise<void> {
    const repo = this.getRepository();
    await repo.delete(id);
  }
}
