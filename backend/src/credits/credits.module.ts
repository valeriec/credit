import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Credit } from './entities/credit.entity';
import { CreditApplication } from '../applications/entities/credit-application.entity';
import { PaymentInstallment } from '../payments/entities/payment-installment.entity';
import { CreditsService } from './credits.service';
import { CreditsController } from './credits.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Credit, CreditApplication, PaymentInstallment])],
  controllers: [CreditsController],
  providers: [CreditsService],
  exports: [CreditsService],
})
export class CreditsModule {}
