import { Test, TestingModule } from '@nestjs/testing';
import { HealthController } from '../health.controller';
import { GetHealthStatusUseCase } from '@context/health/application/use-cases/get-health.use-case';

describe('HealthController', () => {
  let controller: HealthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [GetHealthStatusUseCase],
    }).compile();

    controller = module.get<HealthController>(HealthController);
  });

  it('GET /health should return a validated DTO', () => {
    const result = controller.getHealth();
    expect(result.status).toBe('ok');
    expect(result.serviceName).toBe('ddd-nestjs-template');
    expect(result.version).toBe('0.0.1');
    expect(result.startedAt).toBeInstanceOf(Date);
  });
});
