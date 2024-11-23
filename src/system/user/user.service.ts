import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RedisService } from 'src/redis/redis.service';
import { User } from './entities/user.entity';
import { md5 } from 'src/utils';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

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

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
