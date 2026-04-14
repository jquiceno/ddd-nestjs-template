import { IPetRepository } from '../../domain/repositories/pet.repository';

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

  async execute(input: GetPetByIdInput): Promise<GetPetByIdOutput | undefined> {
    const aggregate = await this.petRepository.findById(input.id);

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
