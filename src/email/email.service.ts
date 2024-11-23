import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createTransport, Transporter } from 'nodemailer';
import { ConfigEnum } from 'src/enums/config.enum';

@Injectable()
export class EmailService {
  transporter: Transporter;

  constructor(private readonly configService: ConfigService) {
    this.transporter = createTransport({
      host: this.configService.get(ConfigEnum.EMAIL_HOST), // SMTP 服务器地址
      port: this.configService.get(ConfigEnum.EMAIL_PORT), // SMTP 端口
      secure: true, // 如果是 465 端口，设为 true
      auth: {
        // 邮箱地址
        user: this.configService.get(ConfigEnum.EMAIL_AUTH_USER),
        // 授权码
        pass: this.configService.get(ConfigEnum.EMAIL_AUTH_PASS),
      },
    });
  }

  async sendMail({ to, subject, html }) {
    await this.transporter.sendMail({
      from: {
        name: 'Nest Admin',
        // 邮箱地址
        address: this.configService.get(ConfigEnum.EMAIL_AUTH_USER),
      },
      to,
      subject,
      html,
    });
  }
}
