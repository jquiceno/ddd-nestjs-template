import { Injectable } from '@nestjs/common';
import { readFileSync } from 'node:fs';
import { INpmPackage } from '../../../../interfaces/npmPackage.interface';
import { join } from 'node:path';

@Injectable()
export class GetNpmPackageAdapter {
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
