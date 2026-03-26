export interface IAppInfo {
  status: 'ok';
  name: string;
  version: string;
  startedAt: Date;
}

export interface CreateAppInfoProps extends IAppInfo {
  name: string;
}
