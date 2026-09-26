import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Disbursement } from './entities/disbursement.entity';
import { Credit } from '../credits/entities/credit.entity';
import { CreditApplication } from '../applications/entities/credit-application.entity';
import { DisbursementsService } from './disbursements.service';
import { DisbursementsController } from './disbursements.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Disbursement, Credit, CreditApplication])],
  controllers: [DisbursementsController],
  providers: [DisbursementsService],
})
export class DisbursementsModule {}
