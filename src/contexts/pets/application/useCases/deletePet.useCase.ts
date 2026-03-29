import { IPetRepository } from '../../domain/repositories/pet.repository';

export interface DeletePetInput {
  id: string;
}

export class DeletePetUseCase {
  constructor(private readonly petRepository: IPetRepository) {}

  execute(input: DeletePetInput): boolean {
    return this.petRepository.delete(input.id);
  }
}
