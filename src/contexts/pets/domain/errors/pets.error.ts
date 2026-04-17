import { DomainErrorFactory } from "@shared/domain/errors/domainError.factory";
import { PETS_DOMAIN_CONTEXT } from "../constants";

// export const PetsError = new DomainErrorFactory(PETS_DOMAIN_CONTEXT);   

export class PetsErrorFactory extends DomainErrorFactory {
    constructor() {
        super(PETS_DOMAIN_CONTEXT);
    }

    notFoundById(entityId: string) {
        return this.notFound(`Pet with id ${entityId} not found`, { entityId });
    }
}

export const petsError = new PetsErrorFactory();