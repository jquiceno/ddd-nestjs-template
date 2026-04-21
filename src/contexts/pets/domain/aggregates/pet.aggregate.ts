import { randomUUID } from 'node:crypto';

import { RootAggregate } from '@shared/domain/aggregates/root.aggregate';

import { CreatePetProps, IPet, UpdatePetProps } from '../entities/pet.entity';

export class PetAggregate extends RootAggregate<IPet> {
  constructor(entity: IPet) {
    super(entity);
  }

  get name(): IPet['name'] {
    return this._entity.name;
  }

  get birthDate(): IPet['birthDate'] {
    return this._entity.birthDate;
  }

  get breed(): IPet['breed'] {
    return this._entity.breed;
  }

  static create(props: CreatePetProps): PetAggregate {
    const now = new Date();
    const entity: IPet = {
      id: randomUUID(),
      name: props.name,
      birthDate: props.birthDate,
      breed: props.breed,
      createdAt: now,
      updatedAt: now,
    };
    return new PetAggregate(entity);
  }

  update(props: UpdatePetProps): PetAggregate {
    const now = new Date();

    const entity: IPet = {
      id: this._entity.id,
      createdAt: this._entity.createdAt,
      name: props.name ?? this._entity.name,
      birthDate: props.birthDate ?? this._entity.birthDate,
      breed: props.breed ?? this._entity.breed,
      updatedAt: now,
    };

    return new PetAggregate(entity);
  }
}
