import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { CreatePetUseCase } from '@context/pets/application/useCases/createPet.useCase';
import { DeletePetUseCase } from '@context/pets/application/useCases/deletePet.useCase';
import { GetPetByIdUseCase } from '@context/pets/application/useCases/getPetById.useCase';
import { ListPetsUseCase } from '@context/pets/application/useCases/listPets.useCase';
import { UpdatePetUseCase } from '@context/pets/application/useCases/updatePet.useCase';

import { UseInterceptors } from '@nestjs/common';
import { CreatePetBodyDto, PetResponseDto, UpdatePetBodyDto } from './pets.dto';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { NotFoundError } from '@shared/domain/errors/baseErrors';

@Controller('pets')
@UsePipes(
  new ValidationPipe({
    whitelist: true,
    transform: true,
    transformOptions: { enableImplicitConversion: true },
  }),
)
@UseInterceptors(CacheInterceptor)
export class PetsController {
  constructor(
    private readonly createPetUseCase: CreatePetUseCase,
    private readonly getPetByIdUseCase: GetPetByIdUseCase,
    private readonly listPetsUseCase: ListPetsUseCase,
    private readonly updatePetUseCase: UpdatePetUseCase,
    private readonly deletePetUseCase: DeletePetUseCase,
  ) {}

  @Post()
  async create(@Body() body: CreatePetBodyDto): Promise<PetResponseDto> {
    const result = await this.createPetUseCase.execute({
      name: body.name,
      birthDate: body.birthDate,
      breed: body.breed,
    });
    return {
      id: result.id,
      name: result.name,
      birthDate: result.birthDate,
      breed: result.breed,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
    };
  }

  @Get()
  async findAll(): Promise<PetResponseDto[]> {
    const pets = await this.listPetsUseCase.execute();
    return pets.map((pet) => ({
      id: pet.id,
      name: pet.name,
      birthDate: pet.birthDate,
      breed: pet.breed,
      createdAt: pet.createdAt,
      updatedAt: pet.updatedAt,
    }));
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<PetResponseDto> {
    const pet = await this.getPetByIdUseCase.execute({ id });

    if (pet instanceof NotFoundError) {
      throw new NotFoundException(pet.message);
    }

    return pet;
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() body: UpdatePetBodyDto,
  ): Promise<PetResponseDto> {
    const pet = await this.updatePetUseCase.execute({ id, ...body });

    if (!pet) {
      throw new NotFoundException(`Pet with id ${id} not found`);
    }

    return pet;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string): void {
    const deleted = this.deletePetUseCase.execute({ id });
    if (!deleted) {
      throw new NotFoundException(`Pet with id ${id} not found`);
    }
  }
}
