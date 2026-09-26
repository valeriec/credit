import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../core/services/api.service';
import { CreditApplication } from '../core/models/interfaces';
import { ApplicationStatus } from '../core/models/enums';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  private apiService = inject(ApiService);

  stats = {
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    disbursed: 0
  };

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    this.apiService.listApplications().subscribe({
      next: (applications) => {
        this.stats.total = applications.length;
        this.stats.pending = applications.filter(a => a.status === ApplicationStatus.PENDING).length;
        this.stats.approved = applications.filter(a => a.status === ApplicationStatus.APPROVED).length;
        this.stats.rejected = applications.filter(a => a.status === ApplicationStatus.REJECTED).length;
        this.stats.disbursed = applications.filter(a => a.status === ApplicationStatus.DISBURSED).length;
      }
    });
  }
}
