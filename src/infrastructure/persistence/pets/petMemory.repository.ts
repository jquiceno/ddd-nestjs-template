import { IPetRepository } from '@context/pets/domain/repositories/pet.repository';
import { PetAggregate } from '@context/pets/domain/aggregates/pet.aggregate';
import { RootMemoryRepository } from '../repositories/rootMemory.repository';
import { IPetDocument } from './petDocument.interface';
import { ICache } from '@infrastructure/interfaces/cache.interface';

export class PetMemoryRepository
  extends RootMemoryRepository<IPetDocument, PetAggregate>
  implements IPetRepository
{
  constructor(cache: ICache) {
    super(cache, 'PETS');
  }

  toDocument(aggregate: PetAggregate): IPetDocument {
    return {
      id: aggregate.id,
      name: aggregate.name,
      birthDate: aggregate.birthDate,
      breed: aggregate.breed,
      createdAt: aggregate.createdAt,
      updatedAt: aggregate.updatedAt,
    };
  }

  toAggregate(document: IPetDocument): PetAggregate {
    return new PetAggregate({
      id: document.id,
      createdAt: document.createdAt,
      updatedAt: document.updatedAt,
      name: document.name,
      birthDate: document.birthDate,
      breed: document.breed,
    });
  }
}
