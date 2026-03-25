import { HealthAggregate } from '@context/health/domain/aggregates/health.aggregate';
// import { readFileSync } from 'node:fs';
// import { join } from 'node:path';

// type PackageJson = {
//   name: string;
//   version: string;
// };

export class GetHealthStatusUseCase {
  execute(): HealthAggregate {
    const newHealthStatus = HealthAggregate.create({
      status: 'ok',
      serviceName: 'test-service',
      version: '1.0.0',
    });

    return newHealthStatus;
  }

  // private readPackageJson(): PackageJson {
  //   const raw = readFileSync(join(process.cwd(), 'package.json'), 'utf-8');
  //   return JSON.parse(raw) as PackageJson;
  // }
}
