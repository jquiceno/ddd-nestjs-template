import { IDocumentRootEntity } from '../interfaces/doc.root';

export interface IPetDocument extends IDocumentRootEntity {
  name: string;
  birthDate: Date;
  breed: string;
}
