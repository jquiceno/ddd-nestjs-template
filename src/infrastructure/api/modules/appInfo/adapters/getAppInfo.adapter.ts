import { Injectable } from '@nestjs/common';
import { IGetAppInfoService } from '@context/appInfo/application/interfaces/getAppInfo.service.interface';
import { AppInfoAggregate } from '@context/appInfo/domain/aggregates/appInfo.aggregate';
import { GetNpmPackageAdapter } from './getNpmPackage.adapter';

@Injectable()
export class GetAppInfoAdapter implements IGetAppInfoService {
  private readonly startedAt: Date;

  constructor(private readonly getNpmPackageAdapter: GetNpmPackageAdapter) {
    this.startedAt = new Date();
  }

  execute(): AppInfoAggregate {
    const npmPackage = this.getNpmPackageAdapter.execute();

    return AppInfoAggregate.create({
      status: 'ok',
      name: npmPackage.name,
      version: npmPackage.version,
      startedAt: this.startedAt,
    });
  }
}
