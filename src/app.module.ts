import { Module } from '@nestjs/common';
import { HealthModule } from './infrastructure/api/modules/health/health.module';

@Module({
  imports: [HealthModule],
})
export class AppModule {}
