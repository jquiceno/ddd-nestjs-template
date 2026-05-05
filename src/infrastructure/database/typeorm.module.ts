import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { ApiConfigModule } from '@api/config/config.module';
import { DatabaseConfig } from '@api/config/config.types';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ApiConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const db = configService.getOrThrow<DatabaseConfig>('database');
        return {
          type: 'mssql',
          host: db.host,
          port: db.port,
          username: db.username,
          password: db.password,
          database: db.database,
          autoLoadEntities: true,
          synchronize: db.synchronize,
          options: { encrypt: db.encrypt },
        };
      },
    }),
  ],
  exports: [TypeOrmModule],
})
export class TypeOrmDatabaseModule {}
