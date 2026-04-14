import { PetAggregate } from '../../domain/aggregates/pet.aggregate';
import { IPetRepository } from '../../domain/repositories/pet.repository';

export interface CreatePetInput {
  name: string;
  birthDate: Date;
  breed: string;
}

export interface CreatePetOutput {
  id: string;
  name: string;
  birthDate: Date;
  breed: string;
  createdAt: Date;
  updatedAt: Date;
}

export class CreatePetUseCase {
  constructor(private readonly petRepository: IPetRepository) {}

  async execute(input: CreatePetInput): Promise<CreatePetOutput> {
    const aggregate = PetAggregate.create({
      name: input.name,
      birthDate: input.birthDate,
      breed: input.breed,
    });

    const saved = await this.petRepository.create(aggregate);

    return {
      id: saved.id,
      name: saved.name,
      birthDate: saved.birthDate,
      breed: saved.breed,
      createdAt: saved.createdAt,
      updatedAt: saved.updatedAt,
    };
  }
}
