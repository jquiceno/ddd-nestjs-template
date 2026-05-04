import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreatePetBodyDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @Type(() => Date)
  @IsDate()
  birthDate!: Date;

  @IsString()
  @IsNotEmpty()
  breed!: string;
}

export class UpdatePetBodyDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  birthDate?: Date;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  breed?: string;
}

export class PetResponseDto {
  @IsUUID()
  id!: string;

  @IsString()
  name!: string;

  @Type(() => Date)
  @IsDate()
  birthDate!: Date;

  @IsString()
  breed!: string;

  @Type(() => Date)
  @IsDate()
  createdAt!: Date;

  @Type(() => Date)
  @IsDate()
  updatedAt!: Date;
}
