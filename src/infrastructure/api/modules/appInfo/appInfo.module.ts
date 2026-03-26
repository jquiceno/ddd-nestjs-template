import { Module } from '@nestjs/common';
import { GetAppInfoUseCase } from '@context/appInfo/application/useCases/getAppInfo.useCase';
import { AppInfoController } from './appInfo.controller';
import { TerminusModule } from '@nestjs/terminus';
import { GetAppInfoAdapter } from 'src/infrastructure/api/modules/appInfo/adapters/getAppInfo.adapter';
import { GetNpmPackageAdapter } from 'src/infrastructure/api/modules/appInfo/adapters/getNpmPackage.adapter';

@Module({
  controllers: [AppInfoController],
  providers: [
    GetNpmPackageAdapter,
    GetAppInfoAdapter,
    {
      provide: GetAppInfoUseCase,
      useFactory: (getAppInfoService: GetAppInfoAdapter) =>
        new GetAppInfoUseCase(getAppInfoService),
      inject: [GetAppInfoAdapter],
    },
  ],
  imports: [TerminusModule],
})
export class AppInfoModule {}
