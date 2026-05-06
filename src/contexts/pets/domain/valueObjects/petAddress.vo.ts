import { Result } from '@shared/domain/result/result';
import { ValueObject } from '@shared/domain/valueObjects/valueObject';
import { petsErrors } from '../errors/pets.errors';
import { PetAddressValue } from '../entities/pet.entity';

const ORIGIN = 'PetAddress.create';

export class PetAddress extends ValueObject<PetAddressValue> {
  private constructor(value: PetAddressValue) {
    super(value);
  }

  static create(value: PetAddressValue): Result<PetAddress> {
    if (!value || typeof value !== 'object') {
      return Result.fail(
        petsErrors.invalidAddress(ORIGIN, { reason: 'address must be a valid object' }),
      );
    }

    if (typeof value.street !== 'string' || value.street.trim().length === 0) {
      return Result.fail(
        petsErrors.invalidAddress(ORIGIN, { reason: 'address.street must be a non-empty string' }),
      );
    }

    if (typeof value.city !== 'string' || value.city.trim().length === 0) {
      return Result.fail(
        petsErrors.invalidAddress(ORIGIN, { reason: 'address.city must be a non-empty string' }),
      );
    }

    if (typeof value.zipCode !== 'string' || value.zipCode.trim().length === 0) {
      return Result.fail(
        petsErrors.invalidAddress(ORIGIN, { reason: 'address.zipCode must be a non-empty string' }),
      );
    }

    return Result.ok(new PetAddress({
      street: value.street.trim(),
      city: value.city.trim(),
      zipCode: value.zipCode.trim(),
    }));
  }
}
