import { AppInfoAggregate } from '../../domain/aggregates/appInfo.aggregate';
import { IGetAppInfoService } from '../interfaces/getAppInfo.service.interface';

export class GetAppInfoUseCase {
  constructor(private readonly getAppInfoService: IGetAppInfoService) {}

  execute(): AppInfoAggregate {
    return this.getAppInfoService.execute();
  }
}
