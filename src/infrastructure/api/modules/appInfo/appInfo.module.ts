import { Module } from '@nestjs/common';
import { GetAppInfoUseCase } from '@context/appInfo/application/useCases/getAppInfo.useCase';
import { AppInfoController } from './appInfo.controller';
import { TerminusModule } from '@nestjs/terminus';
import { GetNpmPackageAdapter } from 'src/infrastructure/api/modules/appInfo/adapters/getNpmPackage.adapter';

@Module({
  controllers: [AppInfoController],
  providers: [
    GetNpmPackageAdapter,
    {
      provide: GetAppInfoUseCase,
      useFactory: (getNpmPackageAdapter: GetNpmPackageAdapter) =>
        new GetAppInfoUseCase(getNpmPackageAdapter),
      inject: [GetNpmPackageAdapter],
    },
  ],
  imports: [TerminusModule],
})
export class AppInfoModule {}
