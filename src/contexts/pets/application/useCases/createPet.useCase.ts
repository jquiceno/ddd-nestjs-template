import { Result } from '@shared/domain/result/result';
import { ConflictError } from '@shared/domain/errors/baseErrors';
import { PetAggregate } from '../../domain/aggregates/pet.aggregate';
import { IPetRepository } from '../../domain/repositories/pet.repository';
import { CreatePetInput, CreatePetOutput } from './createPet.dto';


export class CreatePetUseCase {
  constructor(private readonly petRepository: IPetRepository) {}

  async execute(input: CreatePetInput): Promise<Result<CreatePetOutput, ConflictError>> {
    const aggregate = PetAggregate.create(input);
    const result = await this.petRepository.create(aggregate);

    if (result.isFail) return result

    const petCreated = result.value;

    return Result.ok({
      id: petCreated.id,
      name: petCreated.name,
      birthDate: petCreated.birthDate,
      breed: petCreated.breed,
      createdAt: petCreated.createdAt,
      updatedAt: petCreated.updatedAt,
    });
  }
}
