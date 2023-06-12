import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { FaqCategory } from './faq-category.entity';

@Entity({ name: 'faqs' })
export class FAQ {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => FaqCategory, (faqCategory) => faqCategory.id)
  @JoinColumn({ name: 'category_id' })
  category: FaqCategory;

  @Index({ fulltext: true })
  @Column({ type: 'varchar', length: 255, unique: true })
  question: string;

  @Column({ type: 'text' })
  answer: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
