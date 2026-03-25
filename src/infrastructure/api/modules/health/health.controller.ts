import { Controller, Get } from '@nestjs/common';
import { GetHealthStatusUseCase } from '@context/health/application/use-cases/get-health.use-case';
import { GetHealthStatusMapper } from './getHealth.mapper';
import { GetHealthStatusDto } from './getHealth.dto';

@Controller('health')
export class HealthController {
  private readonly mapper: GetHealthStatusMapper;

  constructor(private readonly getHealthStatusUseCase: GetHealthStatusUseCase) {
    this.mapper = new GetHealthStatusMapper();
  }

  @Get()
  getHealth(): GetHealthStatusDto {
    return this.mapper.toResponse(this.getHealthStatusUseCase.execute());
  }
}
