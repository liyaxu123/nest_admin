import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({
  name: 'sys_users',
  comment: '用户信息表',
})
export class User {
  @PrimaryGeneratedColumn({ comment: '用户ID' })
  id: number;

  @Column({
    type: 'varchar',
    length: 30,
    nullable: false,
    comment: '用户账号',
  })
  username: string;

  @Column({
    type: 'varchar',
    length: 200,
    nullable: false,
    default: '',
    comment: '用户登录密码',
  })
  password: string;

  @Column({
    type: 'varchar',
    length: 30,
    comment: '用户昵称',
  })
  nickName: string;

  //00表示系统用户
  @Column({
    type: 'varchar',
    length: 2,
    default: '00',
    comment: '用户类型',
  })
  userType: string;

  @Column({
    type: 'varchar',
    length: 50,
    default: '',
    comment: '邮箱',
  })
  email: string;

  @Column({
    type: 'varchar',
    default: '',
    length: 11,
    comment: '手机号码',
  })
  phonenumber: string;

  //0男 1女 2未知
  @Column({
    type: 'char',
    default: '2',
    length: 1,
    comment: '性别',
  })
  sex: string;

  @Column({ type: 'varchar', name: 'avatar', default: '', comment: '头像地址' })
  avatar: string;

  @Column({
    type: 'varchar',
    length: 128,
    default: '',
    comment: '最后登录IP',
  })
  loginIp: string;

  @Column({ nullable: true, comment: '最后登录时间' })
  loginDate: Date;

  @CreateDateColumn({ comment: '创建时间' })
  createTime: Date;

  @UpdateDateColumn({ comment: '更新时间' })
  updateTime: Date;
}
