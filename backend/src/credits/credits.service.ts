import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Credit } from './entities/credit.entity';
import { CreditApplication } from '../applications/entities/credit-application.entity';
import { PaymentInstallment } from '../payments/entities/payment-installment.entity';
import { CreditStatus } from '../common/enums';

@Injectable()
export class CreditsService {
  constructor(
    @InjectRepository(Credit)
    private creditsRepository: Repository<Credit>,
    @InjectRepository(CreditApplication)
    private applicationsRepository: Repository<CreditApplication>,
    @InjectRepository(PaymentInstallment)
    private paymentsRepository: Repository<PaymentInstallment>,
  ) {}

  async findApprovedCredits(): Promise<any[]> {
    const credits = await this.creditsRepository.find({
      where: { status: CreditStatus.APPROVED },
      relations: ['application'],
      order: { createdAt: 'DESC' },
    });

    return credits.map((credit) => ({
      id: credit.id,
      creditNumber: credit.creditNumber,
      identification: credit.application.identification,
      fullName: credit.application.fullName,
      amount: credit.amount,
      annualInterestRate: credit.annualInterestRate,
      paymentFrequency: credit.paymentFrequency,
      installments: credit.installments,
      status: credit.status,
    }));
  }

  async searchByIdentification(identification: string): Promise<Credit> {
    const application = await this.applicationsRepository.findOne({
      where: { identification },
      relations: ['credit'],
    });

    if (!application || !application.credit) {
      throw new NotFoundException('Crédito no encontrado');
    }

    return application.credit;
  }

  async getPaymentSchedule(creditId: number): Promise<any> {
    const credit = await this.creditsRepository.findOne({
      where: { id: creditId },
      relations: ['application', 'paymentInstallments'],
    });

    if (!credit) {
      throw new NotFoundException('Crédito no encontrado');
    }

    const installments = await this.paymentsRepository.find({
      where: { creditId },
      order: { installmentNumber: 'ASC' },
    });

    return {
      credit: {
        id: credit.id,
        creditNumber: credit.creditNumber,
        fullName: credit.application.fullName,
        identification: credit.application.identification,
        amount: credit.amount,
        annualInterestRate: credit.annualInterestRate,
        paymentFrequency: credit.paymentFrequency,
        installments: credit.installments,
        status: credit.status,
      },
      schedule: installments.map((inst) => ({
        installmentNumber: inst.installmentNumber,
        dueDate: inst.dueDate,
        installmentAmount: inst.installmentAmount,
        interest: inst.interest,
        principal: inst.principal,
        balance: inst.balance,
      })),
    };
  }
}
