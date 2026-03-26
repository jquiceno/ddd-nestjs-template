import { AppInfoAggregate } from '../../domain/aggregates/appInfo.aggregate';

export interface IGetAppInfoService {
  execute(): AppInfoAggregate;
}
