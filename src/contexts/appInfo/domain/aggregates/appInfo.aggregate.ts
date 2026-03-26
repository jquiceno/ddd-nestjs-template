import { CreateAppInfoProps, IAppInfo } from '../entities/appInfo.entity';

export class AppInfoAggregate {
  private readonly _entity: IAppInfo;

  constructor(entity: IAppInfo) {
    this._entity = entity;
  }

  get status(): IAppInfo['status'] {
    return this._entity.status;
  }

  get name(): IAppInfo['name'] {
    return this._entity.name;
  }

  get version(): IAppInfo['version'] {
    return this._entity.version;
  }

  get startedAt(): IAppInfo['startedAt'] {
    return this._entity.startedAt;
  }

  static create(props: CreateAppInfoProps): AppInfoAggregate {
    const entity: IAppInfo = {
      status: props.status,
      name: props.name,
      version: props.version,
      startedAt: props.startedAt,
    };

    return new AppInfoAggregate(entity);
  }
}
