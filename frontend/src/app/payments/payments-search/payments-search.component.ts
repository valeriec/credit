import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { PaymentSchedule } from '../../core/models/interfaces';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-payments-search',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './payments-search.component.html'
})
export class PaymentsSearchComponent {
  private fb = inject(FormBuilder);
  private apiService = inject(ApiService);

  searchForm: FormGroup;
  loading = false;
  errorMessage = '';
  result: PaymentSchedule | null = null;

  constructor() {
    this.searchForm = this.fb.group({
      identification: ['', Validators.required]
    });
  }

  search(): void {
    if (this.searchForm.invalid) return;

    this.loading = true;
    this.errorMessage = '';
    this.result = null;

    const identification = this.searchForm.get('identification')?.value;

    this.apiService.searchCredit(identification)
      .pipe(
        finalize(() => this.loading = false)
      )
      .subscribe({
        next: (credit) => {
          this.apiService.getPayments(credit.id).subscribe({
            next: (schedule) => {
              this.result = schedule;
            },
            error: (error) => {
              this.errorMessage = error.error?.message || 'Error al obtener el plan de pagos';
            }
          });
        },
        error: (error) => {
          this.errorMessage = error.error?.message || 'Crédito no encontrado';
        }
      });
  }
}
