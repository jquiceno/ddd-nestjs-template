import { IRootRepository } from '@shared/domain/repositories/root.repository';
import { PetAggregate } from '../aggregates/pet.aggregate';

export type IPetRepository = IRootRepository<PetAggregate>;
