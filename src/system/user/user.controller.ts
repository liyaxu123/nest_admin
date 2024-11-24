import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Inject,
  Res,
  Req,
  Ip,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { EmailService } from 'src/email/email.service';
import { RedisService } from 'src/redis/redis.service';
import { LoginUserDto } from './dto/login-user.dto';
import * as svgCaptcha from 'svg-captcha';
import { ConfigEnum } from 'src/enums/config.enum';
import { JwtService } from '@nestjs/jwt';
import { UserInfo } from './vo/login-user.vo';
import { ConfigService } from '@nestjs/config';

@Controller('user')
export class UserController {
  @Inject(EmailService)
  private emailService: EmailService;

  @Inject(RedisService)
  private redisService: RedisService;

  @Inject(JwtService)
  private jwtService: JwtService;

  @Inject(ConfigService)
  private configService: ConfigService;

  constructor(private readonly userService: UserService) {}

  @Get('register-captcha')
  async captcha(@Query('address') address: string) {
    const code = Math.random().toString().slice(2, 8);

    // 存储验证码到 redis, 5 分钟过期
    await this.redisService.set(`captcha_${address}`, code, 5 * 60);

    await this.emailService.sendMail({
      to: address,
      subject: '【Nest Admin】验证码',
      html: `<p>尊敬的用户，您好：</p>
      <p>本次请求的邮件验证码是 ${code}，本验证码5分钟内有效，请及时输入。（请勿泄露此验证码）</p>
      <p>如非本人操作，请忽略该邮件。（这是一封自动发送的邮件，请不要直接回复）</p>`,
    });
    return '发送成功';
  }

  @Post('register')
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get('captchaImage')
  async captchaImage(@Req() req, @Res() res) {
    const captcha = svgCaptcha.create({
      size: 4, // 验证码长度
      fontSize: 50, // 文字大小
      width: 100, // 宽度
      height: 34, // 高度
      background: '#cc9966', // 背景颜色
      ignoreChars: '0o1i', // 验证码字符中排除 0o1i
      noise: 4, // 干扰线条的数量
    });
    console.log(captcha.text);

    // 存储验证码到 redis, 5 分钟过期
    await this.redisService.set('captcha_login', captcha.text, 5 * 60);

    res.type('image/svg+xml');
    res.send(captcha.data);
  }

  @Post('login')
  async userLogin(@Body() loginUser: LoginUserDto, @Ip() ip: string) {
    const vo = await this.userService.login(loginUser, ip);
    const { access_token, refresh_token } = this.generateToken(vo.userInfo);
    vo.accessToken = access_token;
    vo.refreshToken = refresh_token;
    return vo;
  }

  @Get('refresh')
  async refreshToken(@Query('refreshToken') refreshToken: string) {
    try {
      const data = this.jwtService.verify(refreshToken);
      const user = await this.userService.findUserById(data.userId);
      const { access_token, refresh_token } = this.generateToken(user);
      return {
        access_token,
        refresh_token,
      };
    } catch (e) {
      throw new UnauthorizedException('token 已失效，请重新登录', e);
    }
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }

  // 生成token
  generateToken(user: UserInfo) {
    const access_token = this.jwtService.sign(
      {
        userId: user.id,
        username: user.username,
        roles: user.roles,
        menus: user.menus,
      },
      {
        expiresIn:
          this.configService.get(ConfigEnum.JWT_ACCESS_TOKEN_EXPIRES_TIME) ||
          '30m',
      },
    );
    const refresh_token = this.jwtService.sign(
      {
        userId: user.id,
      },
      {
        expiresIn:
          this.configService.get(ConfigEnum.JWT_REFRESH_TOKEN_EXPIRES_TIME) ||
          '7d',
      },
    );
    return {
      access_token,
      refresh_token,
    };
  }
}
