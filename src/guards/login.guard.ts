import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { pathToRegexp } from 'path-to-regexp';
import { Observable } from 'rxjs';
import { UnLoginException } from 'src/filters/unlogin.filter';
import { Menu } from 'src/system/menu/entities/menu.entity';
import { URL } from 'url';

interface JwtUserData {
  userId: number;
  username: string;
  roles: string[];
  menus: Menu[];
}

declare module 'express' {
  interface Request {
    user: JwtUserData;
  }
}

@Injectable()
export class LoginGuard implements CanActivate {
  @Inject()
  private reflector: Reflector;

  @Inject(JwtService)
  private jwtService: JwtService;

  private globalWhiteList: any[];

  constructor() {
    // 接口白名单，在名单里面的接口不需要登录
    this.globalWhiteList = [
      { path: '/user/captchaImage', method: 'GET' },
      { path: '/user/register', method: 'POST' },
      { path: '/user/login', method: 'POST' },
      // { path: '/logout', method: 'POST' },
      // { path: '/perm/{id}', method: 'GET' },
      // { path: '/upload', method: 'POST' },
    ];
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // 判断接口是否在白名单中
    const isInWhiteList = this.checkWhiteList(context);
    if (isInWhiteList) {
      return true;
    }

    const request: Request = context.switchToHttp().getRequest();

    // const requireLogin = this.reflector.getAllAndOverride('require-login', [
    //   context.getClass(),
    //   context.getHandler(),
    // ]);

    // // 判断接口是否需要鉴权登录
    // if (!requireLogin) {
    //   return true;
    // }

    const authorization = request.headers.authorization;

    if (!authorization) {
      // throw new UnauthorizedException('用户未登录')
      throw new UnLoginException();
    }

    try {
      const token = authorization.split(' ')[1];
      const data = this.jwtService.verify<JwtUserData>(token);
      request.user = {
        userId: data.userId,
        username: data.username,
        roles: data.roles,
        menus: data.menus,
      };
      return true;
    } catch (e) {
      throw new UnauthorizedException('token 失效，请重新登录', e);
    }
  }

  /**
   * 检查接口是否在白名单内
   * @param ctx
   * @returns
   */
  checkWhiteList(ctx: ExecutionContext): boolean {
    const req = ctx.switchToHttp().getRequest();
    const i = this.globalWhiteList.findIndex((route) => {
      // 请求方法类型相同
      if (
        !route.method ||
        req.method.toUpperCase() === route.method.toUpperCase()
      ) {
        // 使用 URL 类解析请求 URL
        const { pathname } = new URL(req.url, `http://${req.headers.host}`);
        const { regexp } = pathToRegexp(route.path) as {
          regexp: RegExp;
          keys: any[];
        };
        // 对比 url
        return !!regexp.exec(pathname);
      }
      return false;
    });
    // 在白名单内 则 进行下一步， i === -1 ，则不在白名单，需要 比对是否有当前接口权限
    return i > -1;
  }
}
