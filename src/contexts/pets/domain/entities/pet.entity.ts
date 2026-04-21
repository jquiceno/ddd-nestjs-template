import { IRootEntity } from '@shared/domain/interfaces/root.entity';

export interface IPet extends IRootEntity {
  name: string;
  birthDate: Date;
  breed: string;
}

export interface CreatePetProps {
  name: string;
  birthDate: Date;
  breed: string;
}

export interface UpdatePetProps {
  name?: string;
  birthDate?: Date;
  breed?: string;
}
