import { GetHealthStatusUseCase } from '../get-health.use-case';

describe('GetHealthStatusUseCase', () => {
  it('should return an aggregate with ok status', () => {
    const useCase = new GetHealthStatusUseCase();
    const aggregate = useCase.execute();
    expect(aggregate.status).toBe('ok');
    expect(aggregate.serviceName).toBe('ddd-nestjs-template');
    expect(aggregate.version).toBe('0.0.1');
  });
});
