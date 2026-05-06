import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Result } from '@shared/domain/result/result';
import { ConflictError, NotFoundError } from '@shared/domain/errors/baseErrors';
import { PetAggregate } from '@context/pets/domain/aggregates/pet.aggregate';
import { IPetRepository } from '@context/pets/domain/repositories/pet.repository';
import { PetName } from '@context/pets/domain/valueObjects/petName.vo';
import { PetBirthDate } from '@context/pets/domain/valueObjects/petBirthDate.vo';
import { PetBreed } from '@context/pets/domain/valueObjects/petBreed.vo';
import { PetAddress } from '@context/pets/domain/valueObjects/petAddress.vo';
import { petsErrors } from '@context/pets/domain/errors/pets.errors';
import { PetTypeOrmEntity } from './petTypeOrm.entity';

const ORIGIN = 'PetTypeOrmRepository';

export class PetTypeOrmRepository implements IPetRepository {
  constructor(
    @InjectRepository(PetTypeOrmEntity)
    private readonly repo: Repository<PetTypeOrmEntity>,
  ) {}

  async create(aggregate: PetAggregate): Promise<Result<PetAggregate, ConflictError>> {
    const exists = await this.repo.existsBy({ id: aggregate.id });
    if (exists) {
      return Result.fail(
        new ConflictError({
          context: 'pets',
          code: 'PETS_CONFLICT',
          origin: ORIGIN,
          message: `Pet with id ${aggregate.id} already exists`,
        }),
      );
    }

    const entity = this.toEntity(aggregate);
    await this.repo.save(entity);
    return Result.ok(aggregate);
  }

  async findById(id: string): Promise<Result<PetAggregate, NotFoundError>> {
    const entity = await this.repo.findOneBy({ id });
    if (!entity) return Result.fail(petsErrors.notFound(ORIGIN, { id }));
    return Result.ok(this.toAggregate(entity));
  }

  async findAll(): Promise<Result<PetAggregate[], never>> {
    const entities = await this.repo.find();
    return Result.ok(entities.map((e) => this.toAggregate(e)));
  }

  async update(aggregate: PetAggregate): Promise<Result<PetAggregate, NotFoundError>> {
    const exists = await this.repo.existsBy({ id: aggregate.id });
    if (!exists) return Result.fail(petsErrors.notFound(ORIGIN, { id: aggregate.id }));

    await this.repo.save(this.toEntity(aggregate));
    return Result.ok(aggregate);
  }

  async delete(id: string): Promise<Result<boolean, NotFoundError>> {
    const exists = await this.repo.existsBy({ id });
    if (!exists) return Result.fail(petsErrors.notFound(ORIGIN, { id }));

    await this.repo.delete({ id });
    return Result.ok(true);
  }

  async count(): Promise<Result<number, never>> {
    const total = await this.repo.count();
    return Result.ok(total);
  }

  private toEntity(aggregate: PetAggregate): PetTypeOrmEntity {
    const entity = new PetTypeOrmEntity();
    entity.id = aggregate.id;
    entity.name = aggregate.name;
    entity.birthDate = aggregate.birthDate;
    entity.breed = aggregate.breed;
    entity.address = aggregate.address ?? null;
    entity.createdAt = aggregate.createdAt;
    entity.updatedAt = aggregate.updatedAt;
    return entity;
  }

  private toAggregate(entity: PetTypeOrmEntity): PetAggregate {
    const nameResult = PetName.create(entity.name);
    const birthDateResult = PetBirthDate.create(new Date(entity.birthDate));
    const breedResult = PetBreed.create(entity.breed);
    const addressResult = entity.address ? PetAddress.create(entity.address) : null;

    if (
      nameResult.isFail ||
      birthDateResult.isFail ||
      breedResult.isFail ||
      (addressResult !== null && addressResult.isFail)
    ) {
      throw new Error(`Data integrity error: invalid pet record [id=${entity.id}]`);
    }

    return new PetAggregate({
      id: entity.id,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      name: nameResult.value,
      birthDate: birthDateResult.value,
      breed: breedResult.value,
      address: addressResult?.value,
    });
  }
}
