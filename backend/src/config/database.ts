import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [],
  synchronize: process.env.NODE_ENV !== 'production',
});

process.on('exit', async () => {
  console.log('Closing TypeORM connection...');
  await AppDataSource.destroy();
});

process.on('SIGINT', async () => {
  console.log('Closing TypeORM connection...');
  await AppDataSource.destroy();
  process.exit(0);
});

process.on('unhandledRejection', async (err) => {
  console.error('Unhandled rejection:', err);
  console.log('Closing TypeORM connection...');
  await AppDataSource.destroy();
  process.exit(1);
});
