import { Module } from '@nestjs/common';
import { AppInfoModule } from './infrastructure/api/modules/appInfo/appInfo.module';

@Module({
  imports: [AppInfoModule],
})
export class AppModule {}
