import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Entity,
  ManyToOne,
  JoinColumn,
  Column,
} from 'typeorm';
import { Cart } from './cart.entity';
import { Variation } from './variation.entity';

@Entity({ name: 'cart-items' })
export class CartItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Cart, (cart) => cart.id)
  @JoinColumn({ name: 'cart_id' })
  cart: Cart;

  @ManyToOne(() => Variation, (variation) => variation.id)
  @JoinColumn({ name: ' variation_id' })
  variation: Variation;

  @Column({ type: 'smallint' })
  quantity: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
