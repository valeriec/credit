import { IsString, IsEmail, IsNotEmpty, IsNumber, IsEnum, IsDateString, Min } from 'class-validator';
import { EmploymentType, PaymentFrequency } from '../../common/enums';

export class CreateApplicationDto {
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsString()
  @IsNotEmpty()
  identification: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsDateString()
  @IsNotEmpty()
  birthDate: string;

  @IsEnum(EmploymentType)
  @IsNotEmpty()
  employmentType: EmploymentType;

  @IsString()
  @IsNotEmpty()
  workplace: string;

  @IsNumber()
  @Min(0)
  employmentYears: number;

  @IsNumber()
  @Min(0)
  monthlyIncome: number;

  @IsNumber()
  @Min(0)
  requestedAmount: number;

  @IsNumber()
  @Min(1)
  installments: number;

  @IsNumber()
  @Min(0)
  annualInterestRate: number;

  @IsEnum(PaymentFrequency)
  @IsNotEmpty()
  paymentFrequency: PaymentFrequency;

  @IsNumber()
  @Min(0)
  installmentAmount: number;
}
