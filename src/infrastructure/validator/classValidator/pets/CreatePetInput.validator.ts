import { CreatePetInput } from "@context/pets/application/useCases/createPet.dto";
import { Result } from "@shared/domain/result/result";
import { IsDate, IsNotEmpty, IsString, validate } from "class-validator";
import { ValidationError } from "@shared/domain/errors/baseErrors";

class CreatePetInputValidatorSchema implements CreatePetInput {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsDate()
    birthDate: Date;
    
    @IsString()
    @IsNotEmpty()
    breed: string;
}

export class CreatePetInputValidator {
    async validate(value: CreatePetInput): Promise<Result<CreatePetInput, ValidationError>> {
        const schema = new CreatePetInputValidatorSchema();
        const errors = await validate(schema);

        if (!errors.length) return Result.ok(value);

        return Result.fail(new ValidationError({
            message: 'Invalid create pet input',
            context: 'CREATE_PET_INPUT_VALIDATOR',
            attributes: {
                errors: errors.map((error) => error.property),
            },
        }));
    }
}