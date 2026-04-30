import Datastore from '@seald-io/nedb';
import { RootAggregate } from '@shared/domain/aggregates/root.aggregate';
import { ConflictError, NotFoundError } from '@shared/domain/errors/baseErrors';
import { IRootEntity } from '@shared/domain/interfaces/root.entity';
import { IRootRepository } from '@shared/domain/repositories/root.repository';
import { Result } from '@shared/domain/result/result';
import { ICache } from '@infrastructure/interfaces/cache.interface';
import { IDocumentRootEntity } from '../interfaces/doc.root';

type NedbDocument<D> = D & { _id: string };

export abstract class RootMemoryRepository<
  D extends IDocumentRootEntity,
  A extends RootAggregate<IRootEntity>,
> implements IRootRepository<A> {
  private readonly store: Datastore<NedbDocument<D>>;
  private readonly cacheKey: string;

  constructor(
    protected readonly cache: ICache,
    cacheKey: string,
  ) {
    this.cacheKey = cacheKey;
    this.store = new Datastore<NedbDocument<D>>();
    this.store.ensureIndex({ fieldName: 'id', unique: true });
  }

  async create(aggregate: A): Promise<Result<A, ConflictError>> {
    const document = this.toDocument(aggregate);
    const existing = await this.store.findOneAsync({ id: document.id } as Partial<NedbDocument<D>>);

    if (existing) {
      return Result.fail(
        new ConflictError({
          context: 'REPOSITORY',
          code: 'REPOSITORY_CONFLICT',
          origin: `${this.cacheKey}.create`,
          message: `Entity with id "${String(aggregate.id)}" already exists`,
        }),
      );
    }

    await this.store.insertAsync({ ...document, _id: document.id } as NedbDocument<D>);
    return Result.ok(aggregate);
  }

  async findById(id: A['id']): Promise<Result<A, NotFoundError>> {
    const document = await this.store.findOneAsync({ _id: id } as Partial<NedbDocument<D>>);

    if (!document) {
      return Result.fail(
        new NotFoundError({
          context: 'REPOSITORY',
          code: 'REPOSITORY_NOT_FOUND',
          origin: `${this.cacheKey}.findById`,
          message: `Entity with id "${String(id)}" not found`,
        }),
      );
    }

    return Result.ok(this.toAggregate(document));
  }

  async findAll(): Promise<Result<A[], never>> {
    const documents = await this.store.findAsync({} as Partial<NedbDocument<D>>);
    return Result.ok(documents.map((document) => this.toAggregate(document)));
  }

  async update(aggregate: A): Promise<Result<A, NotFoundError>> {
    const document = this.toDocument(aggregate);
    const { numAffected } = await this.store.updateAsync(
      { _id: aggregate.id } as Partial<NedbDocument<D>>,
      { $set: document } as any,
      {},
    );

    if (numAffected === 0) {
      return Result.fail(
        new NotFoundError({
          context: 'REPOSITORY',
          code: 'REPOSITORY_NOT_FOUND',
          origin: `${this.cacheKey}.update`,
          message: `Entity with id "${String(aggregate.id)}" not found`,
        }),
      );
    }

    return Result.ok(aggregate);
  }

  async delete(id: A['id']): Promise<Result<boolean, NotFoundError>> {
    const numRemoved = await this.store.removeAsync(
      { _id: id } as Partial<NedbDocument<D>>,
      {},
    );

    if (numRemoved === 0) {
      return Result.fail(
        new NotFoundError({
          context: 'REPOSITORY',
          code: 'REPOSITORY_NOT_FOUND',
          origin: `${this.cacheKey}.delete`,
          message: `Entity with id "${String(id)}" not found`,
        }),
      );
    }

    return Result.ok(true);
  }

  async count(): Promise<Result<number, never>> {
    const total = await this.store.countAsync({} as Partial<NedbDocument<D>>);
    return Result.ok(total);
  }

  abstract toDocument(_aggregate: A): D;
  abstract toAggregate(_document: D): A;
}
