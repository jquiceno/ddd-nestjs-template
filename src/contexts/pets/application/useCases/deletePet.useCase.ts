import { Result } from '@shared/domain/result/result';
import { NotFoundError } from '@shared/domain/errors/baseErrors';
import { IPetRepository } from '../../domain/repositories/pet.repository';

export interface DeletePetInput {
  id: string;
}

export class DeletePetUseCase {
  constructor(private readonly petRepository: IPetRepository) {}

  async execute(input: DeletePetInput): Promise<Result<void, NotFoundError>> {
    const result = await this.petRepository.delete(input.id);
    if (result.isFail) return Result.fail(result.error);
    return Result.ok(undefined);
  }
}
