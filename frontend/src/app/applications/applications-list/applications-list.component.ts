import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { CreditApplication } from '../../core/models/interfaces';

@Component({
  selector: 'app-applications-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './applications-list.component.html'
})
export class ApplicationsListComponent implements OnInit {
  private apiService = inject(ApiService);
  applications: CreditApplication[] = [];

  ngOnInit(): void {
    this.loadApplications();
  }

  loadApplications(): void {
    this.apiService.listApplications().subscribe({
      next: (data) => {
        this.applications = data;
      }
    });
  }
}
