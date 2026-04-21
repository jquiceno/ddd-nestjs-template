import { Result } from '@shared/domain/result/result';
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

  async execute(): Promise<Result<ListPetsOutput[], never>> {
    const result = await this.petRepository.findAll();

    return Result.ok(
      result.value.map((aggregate) => ({
        id: aggregate.id,
        name: aggregate.name,
        birthDate: aggregate.birthDate,
        breed: aggregate.breed,
        createdAt: aggregate.createdAt,
        updatedAt: aggregate.updatedAt,
      })),
    );
  }
}
