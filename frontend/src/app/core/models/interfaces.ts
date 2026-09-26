import { ApplicationStatus, EmploymentType, PaymentFrequency, Bank, CreditStatus, UserRole } from './enums';

export interface User {
  id: number;
  username: string;
  role: UserRole;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface CreditApplication {
  id: number;
  fullName: string;
  identification: string;
  email: string;
  phone: string;
  birthDate: string;
  employmentType: EmploymentType;
  workplace: string;
  employmentYears: number;
  monthlyIncome: number;
  requestedAmount: number;
  installments: number;
  annualInterestRate: number;
  paymentFrequency: PaymentFrequency;
  installmentAmount: number;
  status: ApplicationStatus;
  observations?: string;
  createdAt: string;
}

export interface CreateApplicationDto {
  fullName: string;
  identification: string;
  email: string;
  phone: string;
  birthDate: string;
  employmentType: EmploymentType;
  workplace: string;
  employmentYears: number;
  monthlyIncome: number;
  requestedAmount: number;
  installments: number;
  annualInterestRate: number;
  paymentFrequency: PaymentFrequency;
  installmentAmount: number;
}

export interface Credit {
  id: number;
  creditNumber: string;
  identification: string;
  fullName: string;
  amount: number;
  annualInterestRate: number;
  paymentFrequency: PaymentFrequency;
  installments: number;
  status: CreditStatus;
}

export interface PaymentInstallment {
  installmentNumber: number;
  dueDate: string;
  installmentAmount: number;
  interest: number;
  principal: number;
  balance: number;
}

export interface PaymentSchedule {
  credit: Credit;
  schedule: PaymentInstallment[];
}
