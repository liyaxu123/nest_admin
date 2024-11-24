import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RedisService } from 'src/redis/redis.service';
import { User } from './entities/user.entity';
import { md5 } from 'src/utils';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { LoginUserDto } from './dto/login-user.dto';
import { LoginUserVo } from './vo/login-user.vo';

@Injectable()
export class UserService {
  @Inject(RedisService)
  private redisService: RedisService;

  @InjectRepository(User)
  private userRepository: Repository<User>;

  /**
   * 注册用户
   * @param createUserDto
   */
  async create(createUserDto: CreateUserDto) {
    const captcha = await this.redisService.get(
      `captcha_${createUserDto.email}`,
    );

    if (!captcha) {
      throw new HttpException('验证码已失效', HttpStatus.BAD_REQUEST);
    }

    if (createUserDto.captcha !== captcha) {
      throw new HttpException('验证码不正确', HttpStatus.BAD_REQUEST);
    }

    const foundUser = await this.userRepository.findOneBy({
      username: createUserDto.username,
    });

    if (foundUser) {
      throw new HttpException('用户已存在', HttpStatus.BAD_REQUEST);
    }

    const newUser = new User();
    newUser.username = createUserDto.username;
    newUser.password = md5(createUserDto.password);
    newUser.email = createUserDto.email;
    newUser.nickName = createUserDto.nickName;

    try {
      await this.userRepository.save(newUser);
      return '注册成功';
    } catch (e) {
      return '注册失败';
    }
  }

  /**
   * 用户登录
   * @param loginUser
   */
  async login(loginUser: LoginUserDto, ip: string): Promise<LoginUserVo> {
    const captcha = await this.redisService.get('captcha_login');
    if (!captcha) {
      throw new HttpException('验证码已失效', HttpStatus.BAD_REQUEST);
    }

    if (loginUser.captcha.toUpperCase() !== captcha.toUpperCase()) {
      throw new HttpException('验证码不正确', HttpStatus.BAD_REQUEST);
    }

    const foundUser = await this.userRepository.findOne({
      where: {
        username: loginUser.username,
      },
      // 关联查询出用户对应的角色和角色对应的菜单
      relations: ['roles', 'roles.menus'],
    });

    if (!foundUser) {
      throw new HttpException('用户不存在', HttpStatus.BAD_REQUEST);
    }

    if (foundUser.password !== md5(loginUser.password)) {
      throw new HttpException('密码错误', HttpStatus.BAD_REQUEST);
    }

    // 更新用户的登录时间和登录IP
    const loginDate = new Date();
    await this.userRepository.update(
      {
        id: foundUser.id,
      },
      {
        loginDate: loginDate,
        loginIp: ip,
      },
    );

    const vo = new LoginUserVo();
    vo.userInfo = {
      id: foundUser.id,
      username: foundUser.username,
      nickName: foundUser.nickName,
      userType: foundUser.userType,
      email: foundUser.email,
      phonenumber: foundUser.phonenumber,
      sex: foundUser.sex,
      avatar: foundUser.avatar,
      loginIp: ip,
      loginDate: loginDate.getTime(),
      createTime: foundUser.createTime.getTime(),
      updateTime: foundUser.updateTime.getTime(),
      roles: foundUser.roles.map((item) => item.roleName),
      menus: foundUser.roles.reduce((arr, item) => {
        item.menus.forEach((permission) => {
          if (arr.indexOf(permission) === -1) {
            arr.push(permission);
          }
        });
        return arr;
      }, []),
    };

    return vo;
  }

  findAll() {
    return `This action returns all user`;
  }

  /**
   * 通过 id 查询用户信息
   * @param userId
   */
  async findUserById(userId: number) {
    const foundUser = await this.userRepository.findOne({
      where: {
        id: userId,
      },
    });

    if (!foundUser) {
      throw new HttpException('用户不存在', HttpStatus.BAD_REQUEST);
    }

    return {
      id: foundUser.id,
      username: foundUser.username,
      nickName: foundUser.nickName,
      userType: foundUser.userType,
      email: foundUser.email,
      phonenumber: foundUser.phonenumber,
      sex: foundUser.sex,
      avatar: foundUser.avatar,
      loginIp: foundUser.loginIp,
      loginDate: foundUser.loginDate.getTime(),
      createTime: foundUser.createTime.getTime(),
      updateTime: foundUser.updateTime.getTime(),
      roles: foundUser.roles.map((item) => item.roleName),
      // 角色之间可能会有重叠的菜单权限，所以需要去重
      menus: foundUser.roles.reduce((arr, item) => {
        item.menus.forEach((permission) => {
          if (arr.indexOf(permission) === -1) {
            arr.push(permission);
          }
        });
        return arr;
      }, []),
    };
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOne({
      where: {
        id,
      },
    });

    return user;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
