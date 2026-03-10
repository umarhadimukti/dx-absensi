import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  constructor() {}

  @Get('/health')
  checkHealth(): Record<any, string> {
    return { message: "OK!" };
  }
}
