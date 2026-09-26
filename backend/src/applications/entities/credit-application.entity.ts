import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { ApplicationStatus, EmploymentType, PaymentFrequency } from '../../common/enums';
import { User } from '../../users/entities/user.entity';
import { Credit } from '../../credits/entities/credit.entity';

@Entity('credit_applications')
export class CreditApplication {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fullName: string;

  @Column()
  identification: string;

  @Column()
  email: string;

  @Column()
  phone: string;

  @Column({ type: 'date' })
  birthDate: Date;

  @Column({ type: 'text' })
  employmentType: EmploymentType;

  @Column()
  workplace: string;

  @Column({ type: 'integer' })
  employmentYears: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  monthlyIncome: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  requestedAmount: number;

  @Column({ type: 'integer' })
  installments: number;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  annualInterestRate: number;

  @Column({ type: 'text' })
  paymentFrequency: PaymentFrequency;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  installmentAmount: number;

  @Column({
    type: 'text',
    default: ApplicationStatus.PENDING,
  })
  status: ApplicationStatus;

  @Column({ type: 'text', nullable: true })
  observations: string | null;

  @Column({
    type: 'datetime',
    nullable: true,
  })
  rejectedAt: Date | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.applications)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: number;

  @OneToOne(() => Credit, (credit) => credit.application)
  credit: Credit;
}
