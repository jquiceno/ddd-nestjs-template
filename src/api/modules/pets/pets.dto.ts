import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsOptional, IsString, IsUUID, ValidateNested } from 'class-validator';

export class PetAddressBodyDto {
  @IsString()
  @IsNotEmpty()
  street!: string;

  @IsString()
  @IsNotEmpty()
  city!: string;

  @IsString()
  @IsNotEmpty()
  zipCode!: string;
}

export class PetAddressResponseDto {
  @IsString()
  street!: string;

  @IsString()
  city!: string;

  @IsString()
  zipCode!: string;
}

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

  @IsOptional()
  @ValidateNested()
  @Type(() => PetAddressBodyDto)
  address?: PetAddressBodyDto;
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

  @IsOptional()
  @ValidateNested()
  @Type(() => PetAddressBodyDto)
  address?: PetAddressBodyDto;
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

  @IsOptional()
  @ValidateNested()
  @Type(() => PetAddressResponseDto)
  address?: PetAddressResponseDto;

  @Type(() => Date)
  @IsDate()
  createdAt!: Date;

  @Type(() => Date)
  @IsDate()
  updatedAt!: Date;
}
