import { Menu } from 'src/system/menu/entities/menu.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('sys_roles', {
  comment: '角色信息表',
})
export class Role {
  @PrimaryGeneratedColumn({ comment: '角色ID' })
  id: number;

  @Column({
    type: 'varchar',
    length: 30,
    comment: '角色名称',
  })
  roleName: string;

  @Column({ type: 'int', default: 0, comment: '显示顺序' })
  roleSort: number;

  @Column({
    type: 'varchar',
    length: 100,
    comment: '角色权限字符串',
  })
  roleKey: string;

  @Column({
    default: true,
    comment: '状态, 0:禁用, 1:开启',
  })
  status: boolean;

  @CreateDateColumn({ comment: '创建时间' })
  createTime: Date;

  @UpdateDateColumn({ comment: '更新时间' })
  updateTime: Date;

  @ManyToMany(() => Menu)
  @JoinTable({
    name: 'sys_role_menus',
  })
  menus: Menu[];
}
