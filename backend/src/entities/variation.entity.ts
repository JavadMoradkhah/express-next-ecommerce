import { Color } from './color.entity';
import { Product } from './product.entity';
import { Size } from './size.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'variations' })
export class Variation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Product, (product) => product.id, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @OneToOne(() => Color, (color) => color.id, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'color_id' })
  color?: Color;

  @OneToOne(() => Size, (size) => size.id, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'size_id' })
  size?: Size;

  @Column({ type: 'decimal', precision: 9, scale: 2, nullable: true })
  price?: number;

  @Column({ name: 'number_in_stock', type: 'smallint' })
  numberInStock: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
