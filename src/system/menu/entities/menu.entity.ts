import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('sys_menus', {
  comment: '菜单权限表',
})
export class Menu {
  @PrimaryGeneratedColumn({ comment: '菜单ID' })
  id: number;

  @Column({ type: 'varchar', length: 50, comment: '菜单名称' })
  menuName: string;

  @Column({
    type: 'char',
    length: 1,
    default: 'M',
    comment: '菜单类型, M目录 C菜单 F按钮',
  })
  menuType: string;

  @Column({
    type: 'varchar',
    length: 100,
    default: '',
    comment: '菜单图标',
  })
  icon: string;

  @Column({
    type: 'varchar',
    length: 100,
    default: '',
    comment: '权限标识',
  })
  perms: string;

  @Column({ type: 'int', nullable: true, comment: '父菜单ID' })
  parentId: number;

  @Column({ default: true, comment: '是否显示, 0否 1是' })
  visible: boolean;

  @Column({ default: true, comment: '菜单状态, 0禁用 1启用' })
  status: boolean;

  @Column({ type: 'int', default: 0, comment: '显示顺序' })
  orderNum: number;

  @Column({
    type: 'varchar',
    length: 200,
    default: '',
    comment: '路由地址',
  })
  path: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: '组件路径',
  })
  component: string;

  @Column({
    type: 'varchar',
    length: 255,
    default: '',
    comment: '路由参数',
  })
  query: string;

  @Column({
    default: false,
    comment: '是否为外链, 0否 1是',
  })
  isFrame: boolean;
}
