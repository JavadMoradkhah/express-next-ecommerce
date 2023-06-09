import {
  Column,
  CreateDateColumn,
  Entity,
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

  @Column({ type: 'varchar', length: 255, unique: true })
  question: string;

  @Column({ type: 'text' })
  answer: string;

  @Column({ type: 'tsvector', select: false })
  document: any;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
