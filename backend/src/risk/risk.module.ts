import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreditApplication } from '../applications/entities/credit-application.entity';
import { Credit } from '../credits/entities/credit.entity';
import { PaymentInstallment } from '../payments/entities/payment-installment.entity';
import { RiskService } from './risk.service';
import { RiskController } from './risk.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CreditApplication, Credit, PaymentInstallment])],
  controllers: [RiskController],
  providers: [RiskService],
})
export class RiskModule {}
