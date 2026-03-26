import { AppInfoAggregate } from '../../domain/aggregates/appInfo.aggregate';
import { IGetNpmPackageService } from '../interfaces/getNpmPackage.service.interface';

export class GetAppInfoUseCase {
  private readonly startedAt: Date;

  constructor(private readonly getNpmPackageService: IGetNpmPackageService) {
    this.startedAt = new Date();
  }

  execute(): AppInfoAggregate {
    const npmPackage = this.getNpmPackageService.execute();

    return AppInfoAggregate.create({
      status: 'ok',
      name: npmPackage.name,
      version: npmPackage.version,
      startedAt: this.startedAt,
    });
  }
}
