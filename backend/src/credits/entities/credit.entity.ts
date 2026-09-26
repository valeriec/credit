import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { CreditStatus, PaymentFrequency } from '../../common/enums';
import { CreditApplication } from '../../applications/entities/credit-application.entity';
import { PaymentInstallment } from '../../payments/entities/payment-installment.entity';
import { Disbursement } from '../../disbursements/entities/disbursement.entity';

@Entity('credits')
export class Credit {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  creditNumber: string;

  @Column()
  applicationId: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  annualInterestRate: number;

  @Column({ type: 'integer' })
  installments: number;

  @Column({ type: 'text' })
  paymentFrequency: PaymentFrequency;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  installmentAmount: number;

  @Column({
    type: 'text',
    default: CreditStatus.APPROVED,
  })
  status: CreditStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToOne(() => CreditApplication, (application) => application.credit)
  @JoinColumn({ name: 'applicationId' })
  application: CreditApplication;

  @OneToMany(() => PaymentInstallment, (installment) => installment.credit)
  paymentInstallments: PaymentInstallment[];

  @OneToOne(() => Disbursement, (disbursement) => disbursement.credit)
  disbursement: Disbursement;
}
