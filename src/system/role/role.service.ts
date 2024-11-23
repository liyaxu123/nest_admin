import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { In, Repository } from 'typeorm';
import { Menu } from '../menu/entities/menu.entity';

@Injectable()
export class RoleService {
  @InjectRepository(Role)
  private roleRepository: Repository<Role>;

  @InjectRepository(Menu)
  private menuRepository: Repository<Menu>;

  /**
   * 创建角色
   * @param createRoleDto 包含创建角色所需数据的DTO
   * @returns 创建角色的结果信息
   */
  async create(createRoleDto: CreateRoleDto) {
    // 如果 menuIds 存在且不为空，则查询对应的菜单
    let menus: Menu[] = [];
    if (createRoleDto.menuIds && createRoleDto.menuIds.length > 0) {
      menus = await this.menuRepository.findBy({
        id: In(createRoleDto.menuIds),
      });

      // 如果某些菜单 ID 无效，可进行校验并抛出异常
      if (menus.length !== createRoleDto.menuIds.length) {
        throw new Error('Some menu IDs are invalid.');
      }
    }

    // 创建并保存角色
    const role = this.roleRepository.create({ ...createRoleDto, menus });
    return this.roleRepository.save(role);
  }

  findAll() {
    return `This action returns all role`;
  }

  findOne(id: number) {
    return `This action returns a #${id} role`;
  }

  update(id: number, updateRoleDto: UpdateRoleDto) {
    return `This action updates a #${id} role`;
  }

  remove(id: number) {
    return `This action removes a #${id} role`;
  }
}
