import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { Credit } from '../../core/models/interfaces';
import { InstallmentCalculator } from '../../shared/utils/installment.calculator';

@Component({
  selector: 'app-disbursements-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './disbursements-list.component.html'
})
export class DisbursementsListComponent implements OnInit {
  private apiService = inject(ApiService);
  credits: Credit[] = [];

  ngOnInit(): void {
    this.loadCredits();
  }

  loadCredits(): void {
    this.apiService.approvedCredits().subscribe({
      next: (data) => {
        this.credits = data;
      }
    });
  }

  getTerm(credit: Credit): string {
    return InstallmentCalculator.calculateTerm(credit.installments, credit.paymentFrequency);
  }
}
