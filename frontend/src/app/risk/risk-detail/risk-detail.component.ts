import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { CreditApplication } from '../../core/models/interfaces';
import { InstallmentCalculator } from '../../shared/utils/installment.calculator';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-risk-detail',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './risk-detail.component.html'
})
export class RiskDetailComponent implements OnInit {
  private fb = inject(FormBuilder);
  private apiService = inject(ApiService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  application: CreditApplication | null = null;
  decisionForm!: FormGroup;
  loading = false;
  errorMessage = '';
  successMessage = '';
  action = '';

  ngOnInit(): void {
    this.decisionForm = this.fb.group({
      observations: ['', Validators.required]
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadApplication(+id);
    }
  }

  loadApplication(id: number): void {
    this.apiService.getApplication(id).subscribe({
      next: (data) => {
        this.application = data;
      },
      error: () => {
        this.errorMessage = 'Error al cargar la solicitud';
      }
    });
  }

  getAge(): number {
    if (!this.application) return 0;
    return InstallmentCalculator.calculateAge(new Date(this.application.birthDate));
  }

  getTerm(): string {
    if (!this.application) return '';
    return InstallmentCalculator.calculateTerm(
      this.application.installments,
      this.application.paymentFrequency
    );
  }

  approve(): void {
    if (!this.application || this.decisionForm.invalid) return;

    this.loading = true;
    this.action = 'approve';
    this.errorMessage = '';
    this.successMessage = '';

    const observations = this.decisionForm.get('observations')?.value;

    this.apiService.approveApplication(this.application.id, observations)
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: () => {
          this.successMessage = 'Solicitud aprobada correctamente. Crédito creado automáticamente.';
          setTimeout(() => this.router.navigate(['/risk']), 2000);
        },
        error: (error) => {
          this.errorMessage = error.error?.message || 'Error al aprobar la solicitud';
        }
      });
  }

  reject(): void {
    if (!this.application) return;

    this.loading = true;
    this.action = 'reject';
    this.errorMessage = '';
    this.successMessage = '';

    const observations = this.decisionForm.get('observations')?.value || undefined;

    this.apiService.rejectApplication(this.application.id, observations)
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: () => {
          this.successMessage = 'Solicitud rechazada correctamente.';
          setTimeout(() => this.router.navigate(['/risk']), 2000);
        },
        error: (error) => {
          this.errorMessage = error.error?.message || 'Error al rechazar la solicitud';
        }
      });
  }
}
