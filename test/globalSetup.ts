import * as sql from 'mssql';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.test' });

export default async function globalSetup() {
  const config: sql.config = {
    server: process.env.DB_HOST!,
    port: parseInt(process.env.DB_PORT ?? '1433', 10),
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    options: { encrypt: false, trustServerCertificate: true },
  };

  const pool = await sql.connect(config);
  const dbName = process.env.DB_DATABASE!;

  await pool
    .request()
    .query(
      `IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = '${dbName}') CREATE DATABASE [${dbName}]`,
    );

  await pool.close();
}
