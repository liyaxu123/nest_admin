import {
  createParamDecorator,
  ExecutionContext,
  SetMetadata,
} from '@nestjs/common';
import { Request } from 'express';

// 自定义装饰器
// 需要登录
export const RequireLogin = () => SetMetadata('require-login', true);

// 设置权限Code
export const RequirePermission = (...permissions: string[]) =>
  SetMetadata('require-permission', permissions);

// 获取 user 信息传入 handler
export const UserInfo = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();

    if (!request.user) {
      return null;
    }
    return data ? request.user[data] : request.user;
  },
);
