import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { CreditApplication } from '../applications/entities/credit-application.entity';
import { Credit } from '../credits/entities/credit.entity';
import { PaymentInstallment } from '../payments/entities/payment-installment.entity';
import { ApplicationStatus, CreditStatus, PaymentFrequency } from '../common/enums';
import { ApproveApplicationDto } from './dto/approve-application.dto';
import { RejectApplicationDto } from './dto/reject-application.dto';
import { CreditNumberGenerator } from '../common/helpers/credit-number.generator';
import { InstallmentCalculator } from '../common/calculations/installment.calculator';

@Injectable()
export class RiskService {
  constructor(
    @InjectRepository(CreditApplication)
    private applicationsRepository: Repository<CreditApplication>,
    @InjectRepository(Credit)
    private creditsRepository: Repository<Credit>,
    @InjectRepository(PaymentInstallment)
    private paymentsRepository: Repository<PaymentInstallment>,
    private dataSource: DataSource,
  ) {}

  async findPendingApplications(): Promise<CreditApplication[]> {
    return this.applicationsRepository.find({
      where: { status: ApplicationStatus.PENDING },
      order: { createdAt: 'DESC' },
    });
  }

  async approveApplication(id: number, approveDto: ApproveApplicationDto): Promise<CreditApplication> {
    if (!approveDto.observations || approveDto.observations.trim() === '') {
      throw new BadRequestException('Las observaciones son obligatorias para aprobar una solicitud');
    }

    return this.dataSource.transaction(async (manager) => {
      const application = await manager.findOne(CreditApplication, { where: { id } });

      if (!application) {
        throw new NotFoundException('Solicitud no encontrada');
      }

      if (application.status !== ApplicationStatus.PENDING) {
        throw new ConflictException(`No se puede aprobar una solicitud en estado ${application.status}`);
      }

      application.status = ApplicationStatus.APPROVED;
      application.observations = approveDto.observations;
      await manager.save(application);

      const creditNumber = CreditNumberGenerator.generate(id);
      const credit = manager.create(Credit, {
        creditNumber,
        applicationId: application.id,
        amount: application.requestedAmount,
        annualInterestRate: application.annualInterestRate,
        installments: application.installments,
        paymentFrequency: application.paymentFrequency,
        installmentAmount: application.installmentAmount,
        status: CreditStatus.APPROVED,
      });
      await manager.save(credit);

      const paymentInstallments = this.generatePaymentSchedule(
        credit.id,
        application.requestedAmount,
        application.annualInterestRate,
        application.installments,
        application.paymentFrequency,
        application.installmentAmount,
      );

      await manager.save(PaymentInstallment, paymentInstallments);

      return application;
    });
  }

  async rejectApplication(id: number, rejectDto: RejectApplicationDto): Promise<CreditApplication> {
    const application = await this.applicationsRepository.findOne({ where: { id } });

    if (!application) {
      throw new NotFoundException('Solicitud no encontrada');
    }

    if (application.status !== ApplicationStatus.PENDING) {
      throw new ConflictException(`No se puede rechazar una solicitud en estado ${application.status}`);
    }

    application.status = ApplicationStatus.REJECTED;
    application.rejectedAt = new Date();
    if (rejectDto.observations) {
      application.observations = rejectDto.observations;
    }

    return this.applicationsRepository.save(application);
  }

  private generatePaymentSchedule(
    creditId: number,
    amount: number,
    annualInterestRate: number,
    installments: number,
    paymentFrequency: PaymentFrequency,
    installmentAmount: number,
  ): PaymentInstallment[] {
    const schedule: PaymentInstallment[] = [];
    let balance = amount;
    const periodsPerYear = InstallmentCalculator.getPeriodsPerYear(paymentFrequency);
    const periodicRate = annualInterestRate / 100 / periodsPerYear;

    for (let i = 1; i <= installments; i++) {
      const interest = Math.round(balance * periodicRate * 100) / 100;
      let principal = installmentAmount - interest;
      
      if (i === installments) {
        principal = balance;
        installmentAmount = balance + interest;
      }

      balance = Math.round((balance - principal) * 100) / 100;

      const dueDate = this.calculateDueDate(i, paymentFrequency);

      const installment = new PaymentInstallment();
      installment.creditId = creditId;
      installment.installmentNumber = i;
      installment.dueDate = dueDate;
      installment.installmentAmount = Math.round(installmentAmount * 100) / 100;
      installment.interest = interest;
      installment.principal = Math.round(principal * 100) / 100;
      installment.balance = balance;

      schedule.push(installment);
    }

    return schedule;
  }

  private calculateDueDate(installmentNumber: number, paymentFrequency: PaymentFrequency): Date {
    const today = new Date();
    const dueDate = new Date(today);

    switch (paymentFrequency) {
      case PaymentFrequency.QUINCENAL:
        dueDate.setDate(today.getDate() + installmentNumber * 14);
        break;
      case PaymentFrequency.MENSUAL:
        dueDate.setMonth(today.getMonth() + installmentNumber);
        break;
      case PaymentFrequency.ANUAL:
        dueDate.setFullYear(today.getFullYear() + installmentNumber);
        break;
    }

    return dueDate;
  }
}
