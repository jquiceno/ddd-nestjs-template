import { INestApplication } from '@nestjs/common';
import { DataSource } from 'typeorm';

export async function truncateTable(app: INestApplication, tableName: string): Promise<void> {
  const dataSource = app.get(DataSource);
  await dataSource.query(`DELETE FROM ${tableName}`);
}
