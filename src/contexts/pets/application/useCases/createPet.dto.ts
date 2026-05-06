import { PetAddressValue } from '../../domain/entities/pet.entity';
export interface CreatePetInput {
  name: string;
  birthDate: Date;
  breed: string;
  address?: PetAddressValue;
}

export interface CreatePetOutput {
  id: string;
  name: string;
  birthDate: Date;
  breed: string;
  address?: PetAddressValue;
  createdAt: Date;
  updatedAt: Date;
}
