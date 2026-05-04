import { INestApplication } from '@nestjs/common';
import { DataSource } from 'typeorm';

export async function clearPetsTable(app: INestApplication): Promise<void> {
  const dataSource = app.get(DataSource);
  await dataSource.query('DELETE FROM pets');
}
