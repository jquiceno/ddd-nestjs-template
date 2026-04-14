import { IPetRepository } from '../../domain/repositories/pet.repository';

export interface ListPetsOutput {
  id: string;
  name: string;
  birthDate: Date;
  breed: string;
  createdAt: Date;
  updatedAt: Date;
}

export class ListPetsUseCase {
  constructor(private readonly petRepository: IPetRepository) {}

  async execute(): Promise<ListPetsOutput[]> {
    const aggregates = await this.petRepository.findAll();

    return aggregates.map((aggregate) => ({
      id: aggregate.id,
      name: aggregate.name,
      birthDate: aggregate.birthDate,
      breed: aggregate.breed,
      createdAt: aggregate.createdAt,
      updatedAt: aggregate.updatedAt,
    }));
  }
}
