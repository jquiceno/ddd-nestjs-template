import { PetAddressValue } from '../../domain/entities/pet.entity';
export interface ListPetsOutput {
  id: string;
  name: string;
  birthDate: Date;
  breed: string;
  address?: PetAddressValue;
  createdAt: Date;
  updatedAt: Date;
}
