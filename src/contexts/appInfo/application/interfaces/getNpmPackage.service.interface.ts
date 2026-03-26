import { INpmPackage } from './npmPackage.interface';

export interface IGetNpmPackageService {
  execute(): INpmPackage;
}

