import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Bank } from '../../common/enums';
import { Credit } from '../../credits/entities/credit.entity';

@Entity('disbursements')
export class Disbursement {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  creditId: number;

  @Column({ type: 'text' })
  bank: Bank;

  @Column()
  accountNumber: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @CreateDateColumn()
  disbursedAt: Date;

  @OneToOne(() => Credit, (credit) => credit.disbursement)
  @JoinColumn({ name: 'creditId' })
  credit: Credit;
}
