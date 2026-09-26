import { PaymentFrequency } from '../../core/models/enums';

export class InstallmentCalculator {
  static calculateInstallment(
    amount: number,
    annualInterestRate: number,
    installments: number,
    paymentFrequency: PaymentFrequency
  ): number {
    if (annualInterestRate === 0) {
      return amount / installments;
    }

    const periodsPerYear = this.getPeriodsPerYear(paymentFrequency);
    const periodicRate = annualInterestRate / 100 / periodsPerYear;
    const numerator = periodicRate * Math.pow(1 + periodicRate, installments);
    const denominator = Math.pow(1 + periodicRate, installments) - 1;
    const installmentAmount = amount * (numerator / denominator);

    return Math.round(installmentAmount * 100) / 100;
  }

  static getPeriodsPerYear(paymentFrequency: PaymentFrequency): number {
    switch (paymentFrequency) {
      case PaymentFrequency.ANUAL:
        return 1;
      case PaymentFrequency.MENSUAL:
        return 12;
      case PaymentFrequency.QUINCENAL:
        return 24;
      default:
        return 12;
    }
  }

  static calculateAge(birthDate: Date): number {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  }

  static calculateTerm(installments: number, paymentFrequency: PaymentFrequency): string {
    switch (paymentFrequency) {
      case PaymentFrequency.QUINCENAL:
        const months = installments / 2;
        return `${months} ${months === 1 ? 'mes' : 'meses'}`;
      case PaymentFrequency.MENSUAL:
        return `${installments} ${installments === 1 ? 'mes' : 'meses'}`;
      case PaymentFrequency.ANUAL:
        return `${installments} ${installments === 1 ? 'año' : 'años'}`;
      default:
        return '';
    }
  }
}
