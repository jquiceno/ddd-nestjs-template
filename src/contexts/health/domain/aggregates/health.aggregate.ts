import { CreateHealthProps, IHealth } from '../entities/health.entity';

export class HealthAggregate {
  private readonly _entity: IHealth;

  constructor(entity: IHealth) {
    this._entity = entity;
  }

  get status(): IHealth['status'] {
    return this._entity.status;
  }

  get serviceName(): IHealth['serviceName'] {
    return this._entity.serviceName;
  }

  get version(): IHealth['version'] {
    return this._entity.version;
  }

  static create(props: CreateHealthProps): HealthAggregate {
    const entity: IHealth = {
      status: props.status,
      serviceName: props.serviceName,
      version: props.version,
    };

    return new HealthAggregate(entity);
  }
}
