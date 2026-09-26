import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentInstallment } from './entities/payment-installment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PaymentInstallment])],
})
export class PaymentsModule {}
