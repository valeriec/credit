import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreditApplication, CreateApplicationDto, Credit, PaymentSchedule } from '../models/interfaces';
import { Bank } from '../models/enums';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private http = inject(HttpClient);

  listApplications(): Observable<CreditApplication[]> {
    return this.http.get<CreditApplication[]>('/api/applications');
  }

  getApplication(id: number): Observable<CreditApplication> {
    return this.http.get<CreditApplication>(`/api/applications/${id}`);
  }

  createApplication(dto: CreateApplicationDto): Observable<CreditApplication> {
    return this.http.post<CreditApplication>('/api/applications', dto);
  }

  riskApplications(): Observable<CreditApplication[]> {
    return this.http.get<CreditApplication[]>('/api/risk/applications');
  }

  approveApplication(id: number, observations: string): Observable<CreditApplication> {
    return this.http.post<CreditApplication>(`/api/risk/applications/${id}/approve`, { observations });
  }

  rejectApplication(id: number, observations?: string): Observable<CreditApplication> {
    return this.http.post<CreditApplication>(`/api/risk/applications/${id}/reject`, { observations });
  }

  approvedCredits(): Observable<Credit[]> {
    return this.http.get<Credit[]>('/api/credits/approved');
  }

  searchCredit(identification: string): Observable<Credit> {
    return this.http.get<Credit>(`/api/credits/search?identification=${identification}`);
  }

  getPayments(creditId: number): Observable<PaymentSchedule> {
    return this.http.get<PaymentSchedule>(`/api/credits/${creditId}/payments`);
  }

  disburse(creditId: number, bank: Bank, accountNumber: string): Observable<any> {
    return this.http.post(`/api/credits/${creditId}/disbursement`, { bank, accountNumber });
  }
}
