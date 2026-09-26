import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, IsNull } from 'typeorm';
import { Disbursement } from './entities/disbursement.entity';
import { Credit } from '../credits/entities/credit.entity';
import { CreditApplication } from '../applications/entities/credit-application.entity';
import { CreateDisbursementDto } from './dto/create-disbursement.dto';
import { CreditStatus, ApplicationStatus } from '../common/enums';

@Injectable()
export class DisbursementsService {
  constructor(
    @InjectRepository(Disbursement)
    private disbursementsRepository: Repository<Disbursement>,
    @InjectRepository(Credit)
    private creditsRepository: Repository<Credit>,
    @InjectRepository(CreditApplication)
    private applicationsRepository: Repository<CreditApplication>,
    private dataSource: DataSource,
  ) {}

  async createDisbursement(creditId: number, createDisbursementDto: CreateDisbursementDto): Promise<Disbursement> {
    return this.dataSource.transaction(async (manager) => {
      const credit = await manager.findOne(Credit, {
        where: { id: creditId },
        relations: ['application'],
      });

      if (!credit) {
        throw new NotFoundException('Crédito no encontrado');
      }

      if (credit.status !== CreditStatus.APPROVED) {
        throw new ConflictException(`No se puede desembolsar un crédito en estado ${credit.status}`);
      }

      if (credit.application.status !== ApplicationStatus.APPROVED) {
        throw new ConflictException(`La solicitud debe estar en estado APROBADA`);
      }

      const existingDisbursement = await manager.findOne(Disbursement, {
        where: { creditId },
      });

      if (existingDisbursement) {
        throw new ConflictException('Este crédito ya ha sido desembolsado');
      }

      const disbursement = manager.create(Disbursement, {
        creditId,
        bank: createDisbursementDto.bank,
        accountNumber: createDisbursementDto.accountNumber,
        amount: credit.amount,
      });
      await manager.save(disbursement);

      credit.status = CreditStatus.DISBURSED;
      await manager.save(credit);

      credit.application.status = ApplicationStatus.DISBURSED;
      await manager.save(credit.application);

      return disbursement;
    });
  }
}
