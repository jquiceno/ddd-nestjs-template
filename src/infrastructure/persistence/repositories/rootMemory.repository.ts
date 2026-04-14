import { RootAggregate } from '@shared/domain/aggregates/root.aggregate';
import { IRootEntity } from '@shared/domain/interfaces/root.entity';
import { IRootRepository } from '@shared/domain/repositories/root.repository';
import { IDocumentRootEntity } from '../interfaces/doc.root';
import { ICache } from '../../interfaces/cache.interface';

export abstract class RootMemoryRepository<
  D extends IDocumentRootEntity,
  A extends RootAggregate<IRootEntity>,
> implements IRootRepository<A> {
  private readonly store = new Map<string, D>();
  private readonly cacheKey: string;

  constructor(private readonly cache: ICache, cacheKey: string) {
    this.cache = cache;
    this.cacheKey = cacheKey
  }

  async create(aggregate: A): Promise<A> {
    if (this.store.has(aggregate.id)) {
      throw new Error(
        `Entity with id "${String(aggregate.id)}" already exists`,
      );
    }

    this.cache.del(this.cacheKey);
    

    const document = this.toDocument(aggregate);

    this.store.set(document.id, document);

    return aggregate;
  }

  async findById(id: A['id']): Promise<A | undefined> {
    const document = this.store.get(id);
    return document ? this.toAggregate(document) : undefined;
  }

  async findAll(): Promise<A[]> {
    try {
      await setTimeout(() => Promise.resolve(), 40000);

      const documents = Array.from(this.store.values());
      return documents.map((document) => this.toAggregate(document));
    } catch (error) {
      console.error('error', error);
      throw error;
    }
  }

  async update(aggregate: A): Promise<A | undefined> {
    const document = this.toDocument(aggregate);
    this.store.set(document.id, document);
    return aggregate;
  }

  async delete(id: A['id']): Promise<boolean> {
    return this.store.delete(id);
  }

  has(id: A['id']): boolean {
    return this.store.has(id);
  }

  async count(): Promise<number> {
    return this.store.size;
  }

  abstract toDocument(_aggregate: A): D;
  abstract toAggregate(_document: D): A;
}
