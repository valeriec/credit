import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreditApplication } from './entities/credit-application.entity';
import { CreateApplicationDto } from './dto/create-application.dto';
import { ApplicationStatus } from '../common/enums';
import { InstallmentCalculator } from '../common/calculations/installment.calculator';

@Injectable()
export class ApplicationsService {
  constructor(
    @InjectRepository(CreditApplication)
    private applicationsRepository: Repository<CreditApplication>,
  ) {}

  async create(createApplicationDto: CreateApplicationDto, userId: number): Promise<CreditApplication> {
    const birthDate = new Date(createApplicationDto.birthDate);
    const age = InstallmentCalculator.calculateAge(birthDate);

    if (age > 80) {
      throw new BadRequestException('No se permiten solicitudes de clientes mayores de 80 años');
    }

    const installmentAmount = InstallmentCalculator.calculateInstallment(
      createApplicationDto.requestedAmount,
      createApplicationDto.annualInterestRate,
      createApplicationDto.installments,
      createApplicationDto.paymentFrequency,
    );

    const application = this.applicationsRepository.create({
      ...createApplicationDto,
      birthDate,
      installmentAmount,
      status: ApplicationStatus.PENDING,
      userId,
    });

    return this.applicationsRepository.save(application);
  }

  async findAll(): Promise<CreditApplication[]> {
    return this.applicationsRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<CreditApplication> {
    return this.applicationsRepository.findOne({ where: { id } });
  }

  async findByStatus(status: ApplicationStatus): Promise<CreditApplication[]> {
    return this.applicationsRepository.find({
      where: { status },
      order: { createdAt: 'DESC' },
    });
  }
}
