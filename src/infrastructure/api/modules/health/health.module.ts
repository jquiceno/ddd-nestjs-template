import { Module } from '@nestjs/common';
import { GetHealthStatusUseCase } from '@context/health/application/use-cases/get-health.use-case';
import { HealthController } from './health.controller';

@Module({
  controllers: [HealthController],
  providers: [GetHealthStatusUseCase],
})
export class HealthModule {}
