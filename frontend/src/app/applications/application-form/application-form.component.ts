import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { EmploymentType, PaymentFrequency } from '../../core/models/enums';
import { InstallmentCalculator } from '../../shared/utils/installment.calculator';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-application-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './application-form.component.html'
})
export class ApplicationFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private apiService = inject(ApiService);
  private router = inject(Router);

  applicationForm!: FormGroup;
  loading = false;
  errorMessage = '';
  successMessage = '';
  calculatedInstallment = 0;
  calculatedAge = 0;

  employmentTypes = Object.values(EmploymentType);
  paymentFrequencies = Object.values(PaymentFrequency);

  ngOnInit(): void {
    this.initForm();
    this.setupValueChanges();
  }

  initForm(): void {
    this.applicationForm = this.fb.group({
      fullName: ['', Validators.required],
      identification: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      birthDate: ['', Validators.required],
      employmentType: [EmploymentType.ASALARIADO, Validators.required],
      workplace: ['', Validators.required],
      employmentYears: [0, [Validators.required, Validators.min(0)]],
      monthlyIncome: [0, [Validators.required, Validators.min(0)]],
      requestedAmount: [0, [Validators.required, Validators.min(0)]],
      installments: [12, [Validators.required, Validators.min(1)]],
      annualInterestRate: [12, [Validators.required, Validators.min(0)]],
      paymentFrequency: [PaymentFrequency.MENSUAL, Validators.required]
    });
  }

  setupValueChanges(): void {
    this.applicationForm.get('birthDate')?.valueChanges.subscribe(() => {
      this.calculateAge();
    });

    this.applicationForm.valueChanges.subscribe(() => {
      this.calculateInstallment();
    });
  }

  calculateAge(): void {
    const birthDate = this.applicationForm.get('birthDate')?.value;
    if (birthDate) {
      this.calculatedAge = InstallmentCalculator.calculateAge(new Date(birthDate));
    }
  }

  calculateInstallment(): void {
    const amount = this.applicationForm.get('requestedAmount')?.value || 0;
    const rate = this.applicationForm.get('annualInterestRate')?.value || 0;
    const installments = this.applicationForm.get('installments')?.value || 1;
    const frequency = this.applicationForm.get('paymentFrequency')?.value || PaymentFrequency.MENSUAL;

    if (amount > 0 && installments > 0) {
      this.calculatedInstallment = InstallmentCalculator.calculateInstallment(
        amount,
        rate,
        installments,
        frequency
      );
    }
  }

  getTerm(): string {
    const installments = this.applicationForm.get('installments')?.value || 0;
    const frequency = this.applicationForm.get('paymentFrequency')?.value || PaymentFrequency.MENSUAL;
    return InstallmentCalculator.calculateTerm(installments, frequency);
  }

  onSubmit(): void {
    if (this.applicationForm.valid) {
      this.loading = true;
      this.errorMessage = '';
      this.successMessage = '';

      const formData = {
        ...this.applicationForm.value,
        installmentAmount: this.calculatedInstallment
      };

      this.apiService.createApplication(formData)
        .pipe(finalize(() => this.loading = false))
        .subscribe({
          next: (response) => {
            this.successMessage = `Solicitud #${response.id} creada correctamente. Estado: ${response.status}.`;
            this.applicationForm.reset({
              employmentType: EmploymentType.ASALARIADO,
              paymentFrequency: PaymentFrequency.MENSUAL,
              installments: 12,
              annualInterestRate: 12,
              employmentYears: 0,
              monthlyIncome: 0,
              requestedAmount: 0
            });
            this.calculatedInstallment = 0;
            this.calculatedAge = 0;
          },
          error: (error) => {
            this.errorMessage = error.error?.message || 'Error al crear la solicitud';
          }
        });
    }
  }
}
