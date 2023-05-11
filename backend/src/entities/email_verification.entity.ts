import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './user.entity';

@Entity({ name: 'email_verifications' })
export class EmailVerification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'varchar', length: 255 })
  otp: string;

  @BeforeInsert()
  async hashOtp() {
    this.otp = await bcrypt.hash(this.otp, 10);
  }

  @Column({ name: 'expires_in', type: 'timestamp' })
  expiresIn: Date;

  @BeforeInsert()
  setExpiration() {
    this.expiresIn = new Date(new Date().getTime() + 1000 * 60 * 60);
  }

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
