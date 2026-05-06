import { PetAddressValue } from '../../domain/entities/pet.entity';
export interface GetPetByIdInput {
  id: string;
}

export interface GetPetByIdOutput {
  id: string;
  name: string;
  birthDate: Date;
  breed: string;
  address?: PetAddressValue;
  createdAt: Date;
  updatedAt: Date;
}
