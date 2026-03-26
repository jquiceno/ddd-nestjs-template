import { Injectable } from '@nestjs/common';
import { readFileSync } from 'node:fs';
import { INpmPackage } from '@context/appInfo/application/interfaces/npmPackage.interface';
import { IGetNpmPackageService } from '@context/appInfo/application/interfaces/getNpmPackage.service.interface';
import { join } from 'node:path';

@Injectable()
export class GetNpmPackageAdapter implements IGetNpmPackageService {
  private readonly npmPackageData: INpmPackage;

  constructor() {
    this.npmPackageData = this.getNpmPackageData();
  }

  execute(): INpmPackage {
    return this.npmPackageData;
  }

  private getNpmPackageData(): INpmPackage {
    const npmPackageData = readFileSync(
      join(process.cwd(), 'package.json'),
      'utf-8',
    );

    return JSON.parse(npmPackageData) as INpmPackage;
  }
}
