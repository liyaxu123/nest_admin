import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { UnloginFilter } from './filters/unlogin.filter';
import { CustomExceptionFilter } from './filters/custom-exception.filter';
import { FormatResponseInterceptor } from './interceptors/format-response.interceptor';
import { InvokeRecordInterceptor } from './interceptors/invoke-record.interceptor';
import { ConfigService } from '@nestjs/config';
import { ConfigEnum } from './enums/config.enum';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());
  // 全局启用格式化响应拦截器
  app.useGlobalInterceptors(new FormatResponseInterceptor());
  // 全局启用访问记录拦截器
  app.useGlobalInterceptors(new InvokeRecordInterceptor());
  // 全局启用未登录过滤器
  app.useGlobalFilters(new UnloginFilter());
  // 全局启用自定义异常过滤器
  app.useGlobalFilters(new CustomExceptionFilter());

  const configService = app.get(ConfigService);
  await app.listen(configService.get(ConfigEnum.NEST_SERVER_PORT));
}
bootstrap();
