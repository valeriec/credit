import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { Credit } from '../../core/models/interfaces';
import { Bank } from '../../core/models/enums';
import { InstallmentCalculator } from '../../shared/utils/installment.calculator';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-disbursement-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './disbursement-form.component.html'
})
export class DisbursementFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private apiService = inject(ApiService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  credit: Credit | null = null;
  disbursementForm!: FormGroup;
  loading = false;
  errorMessage = '';
  successMessage = '';
  banks = Object.values(Bank);

  ngOnInit(): void {
    this.disbursementForm = this.fb.group({
      bank: ['', Validators.required],
      accountNumber: ['', Validators.required]
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadCredit(+id);
    }
  }

  loadCredit(id: number): void {
    this.apiService.approvedCredits().subscribe({
      next: (credits) => {
        this.credit = credits.find(c => c.id === id) || null;
        if (!this.credit) {
          this.errorMessage = 'Crédito no encontrado';
        }
      },
      error: () => {
        this.errorMessage = 'Error al cargar el crédito';
      }
    });
  }

  getTerm(): string {
    if (!this.credit) return '';
    return InstallmentCalculator.calculateTerm(this.credit.installments, this.credit.paymentFrequency);
  }

  onSubmit(): void {
    if (!this.credit || this.disbursementForm.invalid) return;

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const { bank, accountNumber } = this.disbursementForm.value;

    this.apiService.disburse(this.credit.id, bank, accountNumber)
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: () => {
          this.successMessage = 'Desembolso procesado correctamente. Estado: DESEMBOLSADA.';
          setTimeout(() => this.router.navigate(['/disbursements']), 2000);
        },
        error: (error) => {
          this.errorMessage = error.error?.message || 'Error al procesar el desembolso';
        }
      });
  }
}
