import { PetAddressValue } from '../../domain/entities/pet.entity';
export interface UpdatePetInput {
  id: string;
  name?: string;
  birthDate?: Date;
  breed?: string;
  address?: PetAddressValue;
}

export interface UpdatePetOutput {
  id: string;
  name: string;
  birthDate: Date;
  breed: string;
  address?: PetAddressValue;
  createdAt: Date;
  updatedAt: Date;
}
