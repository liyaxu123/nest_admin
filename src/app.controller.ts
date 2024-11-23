import { Controller, Get } from '@nestjs/common';
import { RequireLogin } from './custom.decorator';

@Controller()
export class AppController {
  constructor() {}

  @Get('aaa')
  @RequireLogin()
  aaa(): string {
    return 'Hello World';
  }
}
