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

  execute(input: UpdatePetInput): UpdatePetOutput | undefined {
    const existing = this.petRepository.findById(input.id);

    if (!existing) return undefined;

    const updated = existing.update({
      name: input.name,
      birthDate: input.birthDate,
      breed: input.breed,
    });

    const saved = this.petRepository.update(updated);

    if (!saved) return undefined;

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
