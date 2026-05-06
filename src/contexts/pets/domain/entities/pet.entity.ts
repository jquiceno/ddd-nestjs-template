import { IRootEntity } from '@shared/domain/interfaces/root.entity';
import { PetAddress } from '../valueObjects/petAddress.vo';
import { PetBirthDate } from '../valueObjects/petBirthDate.vo';
import { PetBreed } from '../valueObjects/petBreed.vo';
import { PetName } from '../valueObjects/petName.vo';
export interface PetAddressValue {
  street: string;
  city: string;
  zipCode: string;
}

export interface IPet extends IRootEntity {
  name: PetName;
  birthDate: PetBirthDate;
  breed: PetBreed;
  address?: PetAddress;
}

export interface CreatePetProps {
  name: string;
  birthDate: Date;
  breed: string;
  address?: PetAddressValue;
}

export interface UpdatePetProps {
  name?: string;
  birthDate?: Date;
  breed?: string;
  address?: PetAddressValue;
}
