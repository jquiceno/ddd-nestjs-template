import { randomUUID } from 'node:crypto';

import { Result } from '@shared/domain/result/result';
import { RootAggregate } from '@shared/domain/aggregates/root.aggregate';

import { CreatePetProps, IPet, PetAddressValue, UpdatePetProps } from '../entities/pet.entity';
import { PetAddress } from '../valueObjects/petAddress.vo';
import { PetBirthDate } from '../valueObjects/petBirthDate.vo';
import { PetBreed } from '../valueObjects/petBreed.vo';
import { PetName } from '../valueObjects/petName.vo';

export class PetAggregate extends RootAggregate<IPet> {
  get name(): string {
    return this._entity.name.value;
  }

  get birthDate(): Date {
    return this._entity.birthDate.value;
  }

  get breed(): string {
    return this._entity.breed.value;
  }

  get address(): PetAddressValue | undefined {
    return this._entity.address?.value;
  }

  static create(props: CreatePetProps): Result<PetAggregate> {
    const nameResult = PetName.create(props.name);
    if (nameResult.isFail) return Result.fail(nameResult.error);

    const birthDateResult = PetBirthDate.create(props.birthDate);
    if (birthDateResult.isFail) return Result.fail(birthDateResult.error);

    const breedResult = PetBreed.create(props.breed);
    if (breedResult.isFail) return Result.fail(breedResult.error);

    let address: PetAddress | undefined;
    if (props.address !== undefined) {
      const addressResult = PetAddress.create(props.address);
      if (addressResult.isFail) return Result.fail(addressResult.error);
      address = addressResult.value;
    }

    const now = new Date();
    return Result.ok(new PetAggregate({
      id: randomUUID(),
      name: nameResult.value,
      birthDate: birthDateResult.value,
      breed: breedResult.value,
      address,
      createdAt: now,
      updatedAt: now,
    }));
  }

  update(props: UpdatePetProps): Result<PetAggregate> {
    const nameResult = props.name !== undefined
      ? PetName.create(props.name)
      : Result.ok(this._entity.name);
    if (nameResult.isFail) return Result.fail(nameResult.error);

    const birthDateResult = props.birthDate !== undefined
      ? PetBirthDate.create(props.birthDate)
      : Result.ok(this._entity.birthDate);
    if (birthDateResult.isFail) return Result.fail(birthDateResult.error);

    const breedResult = props.breed !== undefined
      ? PetBreed.create(props.breed)
      : Result.ok(this._entity.breed);
    if (breedResult.isFail) return Result.fail(breedResult.error);

    let address = this._entity.address;
    if (props.address !== undefined) {
      const addressResult = PetAddress.create(props.address);
      if (addressResult.isFail) return Result.fail(addressResult.error);
      address = addressResult.value;
    }

    return Result.ok(new PetAggregate({
      id: this._entity.id,
      createdAt: this._entity.createdAt,
      name: nameResult.value,
      birthDate: birthDateResult.value,
      breed: breedResult.value,
      address,
      updatedAt: new Date(),
    }));
  }
}
