require('dotenv').config();
import { MigrationInterface, QueryRunner } from 'typeorm';
import { Admin, Role } from '../entities/admin.entity';

export class CreateAdminAccount1683197337588 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const adminRepo = queryRunner.connection.getRepository(Admin);

    const admin = new Admin();
    admin.username = process.env.ADMIN_USERNAME;
    admin.email = process.env.ADMIN_EMAIL;
    admin.password = process.env.ADMIN_PASSWORD;
    admin.role = Role.SUPER_ADMIN;

    const result = await adminRepo.insert(admin);

    console.log('✅ The admin account was created successfully:', result);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const adminRepo = queryRunner.connection.getRepository(Admin);

    await adminRepo.delete({ username: process.env.ADMIN_USERNAME });

    console.log('✅ The admin account was removed from the database');
  }
}
