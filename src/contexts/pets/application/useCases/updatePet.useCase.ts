import { Result } from '@shared/domain/result/result';
import { NotFoundError } from '@shared/domain/errors/baseErrors';
import { IPetRepository } from '../../domain/repositories/pet.repository';

export interface UpdatePetInput {
  id: string;
  name: string;
  birthDate: Date;
  breed: string;
}

export interface UpdatePetOutput {
  id: string;
  name: string;
  birthDate: Date;
  breed: string;
  createdAt: Date;
  updatedAt: Date;
}

export class UpdatePetUseCase {
  constructor(private readonly petRepository: IPetRepository) {}

  async execute(input: UpdatePetInput): Promise<Result<UpdatePetOutput, NotFoundError>> {
    const findResult = await this.petRepository.findById(input.id);

    if (findResult.isFail) return Result.fail(findResult.error);

    const updated = findResult.value.update({
      name: input.name,
      birthDate: input.birthDate,
      breed: input.breed,
    });

    const updateResult = await this.petRepository.update(updated);

    if (updateResult.isFail) return updateResult

    const saved = updateResult.value;

    return Result.ok({
      id: saved.id,
      name: saved.name,
      birthDate: saved.birthDate,
      breed: saved.breed,
      createdAt: saved.createdAt,
      updatedAt: saved.updatedAt,
    });
  }
}
