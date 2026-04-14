import { IPetRepository } from '../../domain/repositories/pet.repository';

export interface DeletePetInput {
  id: string;
}

export class DeletePetUseCase {
  constructor(private readonly petRepository: IPetRepository) {}

  async execute(input: DeletePetInput): Promise<boolean> {
    return this.petRepository.delete(input.id);
  }
}
