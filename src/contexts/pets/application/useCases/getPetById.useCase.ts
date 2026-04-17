import { petsError } from '@context/pets/domain/errors/pets.error';
import { IPetRepository } from '../../domain/repositories/pet.repository';
import { NotFoundError } from '@shared/domain/errors/baseErrors';

export interface GetPetByIdInput {
  id: string;
}

export interface GetPetByIdOutput {
  id: string;
  name: string;
  birthDate: Date;
  breed: string;
  createdAt: Date;
  updatedAt: Date;
}

export class GetPetByIdUseCase {
  constructor(private readonly petRepository: IPetRepository) {}

  async execute(input: GetPetByIdInput): Promise<GetPetByIdOutput | NotFoundError> {
    const aggregate = await this.petRepository.findById(input.id);

    if (!aggregate) return petsError.notFoundById(input.id);

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
