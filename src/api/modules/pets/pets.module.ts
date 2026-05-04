import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CreatePetUseCase } from '@context/pets/application/useCases/createPet.useCase';
import { DeletePetUseCase } from '@context/pets/application/useCases/deletePet.useCase';
import { GetPetByIdUseCase } from '@context/pets/application/useCases/getPetById.useCase';
import { ListPetsUseCase } from '@context/pets/application/useCases/listPets.useCase';
import { UpdatePetUseCase } from '@context/pets/application/useCases/updatePet.useCase';
import { PetTypeOrmEntity } from '@infrastructure/persistence/pets/petTypeOrm.entity';
import { PetTypeOrmRepository } from '@infrastructure/persistence/pets/petTypeOrm.repository';

import { PetsController } from './pets.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PetTypeOrmEntity])],
  controllers: [PetsController],
  providers: [
    PetTypeOrmRepository,
    {
      provide: CreatePetUseCase,
      useFactory: (repo: PetTypeOrmRepository) => new CreatePetUseCase(repo),
      inject: [PetTypeOrmRepository],
    },
    {
      provide: GetPetByIdUseCase,
      useFactory: (repo: PetTypeOrmRepository) => new GetPetByIdUseCase(repo),
      inject: [PetTypeOrmRepository],
    },
    {
      provide: ListPetsUseCase,
      useFactory: (repo: PetTypeOrmRepository) => new ListPetsUseCase(repo),
      inject: [PetTypeOrmRepository],
    },
    {
      provide: UpdatePetUseCase,
      useFactory: (repo: PetTypeOrmRepository) => new UpdatePetUseCase(repo),
      inject: [PetTypeOrmRepository],
    },
    {
      provide: DeletePetUseCase,
      useFactory: (repo: PetTypeOrmRepository) => new DeletePetUseCase(repo),
      inject: [PetTypeOrmRepository],
    },
  ],
})
export class PetsModule {}
