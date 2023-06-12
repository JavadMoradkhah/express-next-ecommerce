import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'uploads' })
export class Upload {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'image_name', type: 'varchar', length: 255 })
  imageName: string;

  @Column({ type: 'varchar', length: 255 })
  location: string;

  @Column({
    name: 'image_url',
    generatedType: 'STORED',
    asExpression: `CONCAT(location, image_name)`,
  })
  imageUrl: string;

  @Index({ fulltext: true })
  @Column({ type: 'varchar', length: 255 })
  alt: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
