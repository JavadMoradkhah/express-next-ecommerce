import { Category } from './category.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ProductImage } from './product-image.entity';

@Entity({ name: 'products' })
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Category, (category) => category.id, { cascade: false })
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'decimal', precision: 9, scale: 2 })
  price: number;

  @Column({ type: 'smallint', nullable: true })
  discount?: number;

  @Column({ name: 'order_limit', type: 'smallint', nullable: true })
  orderLimit?: number;

  @Column({ type: 'boolean', default: true })
  orderable: boolean;

  @OneToMany(() => ProductImage, (productImage) => productImage.product)
  images: ProductImage[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
