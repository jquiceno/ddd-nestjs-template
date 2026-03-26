import { Controller, Get } from '@nestjs/common';
import { GetAppInfoUseCase } from '@context/appInfo/application/useCases/getAppInfo.useCase';
import { GetAppInfoMapper } from './appInfo.mapper';
import { GetAppInfoDto } from './appInfo.dto';
import {
  HealthCheck,
  HealthCheckService,
  MemoryHealthIndicator,
} from '@nestjs/terminus';

@Controller()
export class AppInfoController {
  private readonly mapper: GetAppInfoMapper;

  constructor(
    private readonly getAppInfoUseCase: GetAppInfoUseCase,
    private readonly health: HealthCheckService,
    private readonly memory: MemoryHealthIndicator,
  ) {
    this.mapper = new GetAppInfoMapper();
  }

  @Get('info')
  getAppInfo(): GetAppInfoDto {
    const appInfo = this.getAppInfoUseCase.execute();
    return this.mapper.toResponse(appInfo);
  }

  @Get('health')
  @HealthCheck()
  check() {
    return this.health.check([
      () => this.memory.checkHeap('memory', 150 * 1024 * 1024),
    ]);
  }
}
