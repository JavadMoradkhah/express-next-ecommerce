require('dotenv').config();
import { DataSource } from 'typeorm';
import { Category, Admin, Color, Country, ShippingMethod, Size, Upload } from '../entities/';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [Category, Admin, Color, Country, ShippingMethod, Size, Upload],
  synchronize: process.env.NODE_ENV !== 'production',
  migrations: ['dist/migrations/*.js'],
});
