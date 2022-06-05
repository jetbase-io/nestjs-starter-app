import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { RoleEntity } from './models/role.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(RoleEntity)
    private readonly roleRepository: Repository<RoleEntity>,
  ) {}

  async create(dto: CreateRoleDto) {
    return this.roleRepository.save(dto);
  }

  async getRoleByValue(value: string) {
    return await this.roleRepository.find({ where: { value } });
  }
}
