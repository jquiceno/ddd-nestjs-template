import { plainToInstance } from 'class-transformer';
import { validateSync, ValidationError } from 'class-validator';
import { HealthAggregate } from '@context/health/domain/aggregates/health.aggregate';
import { GetHealthStatusDto } from './getHealth.dto';
import { ValidationOutputException } from './validation-output.exception';

export class GetHealthStatusMapper {
  toResponse(healthStatus: HealthAggregate): GetHealthStatusDto {
    const data = {
      status: healthStatus.status,
      serviceName: healthStatus.serviceName,
      version: healthStatus.version,
    };

    const dto: GetHealthStatusDto = plainToInstance(GetHealthStatusDto, data);

    const errors: ValidationError[] = validateSync(dto, {
      forbidUnknownValues: true,
    });

    if (errors.length) {
      throw new ValidationOutputException(errors);
    }

    return dto;
  }
}
