import { IPetRepository } from '../../domain/repositories/pet.repository';
import { mapPetAggregateToReadModel, PetReadModel } from '../pet.readModel';

export interface GetPetByIdInput {
  id: string;
}

export class GetPetByIdUseCase {
  constructor(private readonly petRepository: IPetRepository) {}

  execute(input: GetPetByIdInput): PetReadModel | undefined {
    const aggregate = this.petRepository.findById(input.id);

    if (!aggregate) return undefined;

    return {
      id: aggregate.id,
      name: aggregate.name,
      birthDate: aggregate.birthDate,
      breed: aggregate.breed,
      createdAt: aggregate.createdAt,
      updatedAt: aggregate.updatedAt,
    };
  }
}
