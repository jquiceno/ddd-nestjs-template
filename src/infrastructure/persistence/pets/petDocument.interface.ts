import { IDocumentRootEntity } from '../interfaces/doc.root';
import { PetAddressValue } from '@context/pets/domain/entities/pet.entity';

export interface IPetDocument extends IDocumentRootEntity {
  name: string;
  birthDate: Date;
  breed: string;
  address?: PetAddressValue;
}
