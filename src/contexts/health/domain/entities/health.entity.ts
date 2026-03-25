export interface IHealth {
  status: 'ok';
  serviceName: string;
  version: string;
}

export interface CreateHealthProps extends IHealth {
  serviceName: string;
}
