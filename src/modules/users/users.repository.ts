import { BaseRepository } from 'src/common/base/classes/base.repository';
import { UserEntity } from './models/users.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { Role } from '../roles/enums/role.enum';
import { UpdateUserDto } from './dto/update-user.dto';
import { OrderDirection } from '../admin/dto/pagination-params.dto';

export class UserRepository extends BaseRepository(UserEntity) {
  async createUser(
    createUserDto: CreateUserDto,
    role: Role,
    hashedPassword: string,
  ) {
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
  ) {
    const repo = this.getRepository();

    const data = await repo
      .createQueryBuilder('users')
      .take(take)
      .skip(skip)
      .orderBy(sort, order)
      .getManyAndCount();

    return data;
  }

  async getOneById(id: string) {
    const repo = this.getRepository();

    const user = await repo.findOne({ id });

    return user;
  }

  async getOneByName(username: string) {
    const repo = this.getRepository();

    return await repo.findOne({
      where: { username: username },
    });
  }

  async getOneByConfirmationToken(confirmationToken: string) {
    const repo = this.getRepository();

    return await repo.findOne({
      where: { confirmationToken },
    });
  }

  async updateById(id: string, update: UpdateUserDto) {
    const repo = this.getRepository();
    await repo.update(id, update);
  }

  async updateUserAvatarById(id: string, avatarLocation: string) {
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

    return result.raw[0];
  }

  async updatePassword(userId: string, hashedNewPassword: string) {
    const repo = this.getRepository();
    await repo.update(userId, { password: hashedNewPassword });
  }
}
