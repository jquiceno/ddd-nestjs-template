import { Controller, Get } from '@nestjs/common'

import {
  HealthCheck,
  HealthCheckService,
  MemoryHealthIndicator
} from '@nestjs/terminus'
import { ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { SkipResponseWrap } from '../../decorators/skipResponseWrap.decorator'
import { Result } from '@shared/domain/result/result'
import { healthErrors } from './health.errors'

@ApiTags('health')
@SkipResponseWrap()
@Controller()
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly memory: MemoryHealthIndicator
  ) {}

  @Get('health')
  @HealthCheck()
  @ApiOkResponse({ description: 'Service health status' })
  execute() {
    return this.health.check([
      () => this.memory.checkHeap('memory', 150 * 1024 * 1024)
    ])
  }

  @Get('/debug')
  getError() {
    return Result.fail(
      healthErrors.checkFailed('HealthController.getError', {
        date: new Date().toISOString()
      })
    )
  }
}
