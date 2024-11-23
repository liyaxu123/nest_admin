import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ConfigEnum } from './enums/config.enum';
import { UserModule } from './system/user/user.module';
import { User } from './system/user/entities/user.entity';
import { RedisModule } from './redis/redis.module';
import { EmailModule } from './email/email.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // 设置为全局模块
    }),
    TypeOrmModule.forRootAsync({
      useFactory(configService: ConfigService) {
        return {
          type: configService.get(ConfigEnum.DB_TYPE),
          host: configService.get(ConfigEnum.MYSQL_HOST),
          port: configService.get(ConfigEnum.MYSQL_PORT),
          username: configService.get(ConfigEnum.MYSQL_USERNAME),
          password: configService.get(ConfigEnum.MYSQL_PASSWORD),
          database: configService.get(ConfigEnum.MYSQL_DATABASE),
          entities: [User],
          synchronize: true,
          logging: true,
          poolSize: 10,
          connectorPackage: 'mysql2',
        } as TypeOrmModuleOptions;
      },
      inject: [ConfigService],
    }),
    UserModule,
    RedisModule,
    EmailModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
