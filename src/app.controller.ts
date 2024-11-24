import { Controller, Get } from '@nestjs/common';
import { RequirePermission } from './custom.decorator';

@Controller()
export class AppController {
  constructor() {}

  @Get('aaa')
  @RequirePermission('system:home:link')
  aaa(): string {
    return 'Hello World';
  }
}
