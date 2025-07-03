import { DataSource } from 'typeorm';

export const TestDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username:'postgres',
  password: 'password',
  database: 'test_db',
  synchronize: true,
  logging: false,
  migrationsRun: true,
  migrations: ['src/migration/*.ts'],
});
