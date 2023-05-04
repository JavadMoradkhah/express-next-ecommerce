import { DataSource } from 'typeorm';
import { Category } from '../entities/category.entity';
import { Admin } from '../entities/admin.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [Category, Admin],
  synchronize: process.env.NODE_ENV !== 'production',
  migrations: ['dist/migrations/*.js'],
});
