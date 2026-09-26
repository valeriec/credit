import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { CreditApplication } from '../../core/models/interfaces';

@Component({
  selector: 'app-risk-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './risk-list.component.html'
})
export class RiskListComponent implements OnInit {
  private apiService = inject(ApiService);
  applications: CreditApplication[] = [];

  ngOnInit(): void {
    this.loadApplications();
  }

  loadApplications(): void {
    this.apiService.riskApplications().subscribe({
      next: (data) => {
        this.applications = data;
      }
    });
  }
}
