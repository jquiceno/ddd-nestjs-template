import { Result } from '@shared/domain/result/result';
import { NotFoundError } from '@shared/domain/errors/baseErrors';
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

  async execute(input: GetPetByIdInput): Promise<Result<GetPetByIdOutput, NotFoundError>> {
    const result = await this.petRepository.findById(input.id);

    if (result.isFail) return Result.fail(result.error);

    const aggregate = result.value;

    return Result.ok({
      id: aggregate.id,
      name: aggregate.name,
      birthDate: aggregate.birthDate,
      breed: aggregate.breed,
      createdAt: aggregate.createdAt,
      updatedAt: aggregate.updatedAt,
    });
  }
}
