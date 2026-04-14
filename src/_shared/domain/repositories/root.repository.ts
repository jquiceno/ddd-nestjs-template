import { IRootEntity } from '../interfaces/root.entity';
import { RootAggregate } from '../aggregates/root.aggregate';

export interface IRootRepository<Aggregate extends RootAggregate<IRootEntity>> {
  create(aggregate: Aggregate): Promise<Aggregate>;
  findById(id: Aggregate['id']): Promise<Aggregate | undefined>;
  findAll(): Promise<Aggregate[]>;
  update(aggregate: Aggregate): Promise<Aggregate | undefined>;
  delete(id: Aggregate['id']): Promise<boolean>;
  count(): Promise<number>;
}
