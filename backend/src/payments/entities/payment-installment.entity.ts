import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Credit } from '../../credits/entities/credit.entity';

@Entity('payment_installments')
export class PaymentInstallment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  creditId: number;

  @Column({ type: 'integer' })
  installmentNumber: number;

  @Column({ type: 'date' })
  dueDate: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  installmentAmount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  interest: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  principal: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  balance: number;

  @ManyToOne(() => Credit, (credit) => credit.paymentInstallments)
  @JoinColumn({ name: 'creditId' })
  credit: Credit;
}
