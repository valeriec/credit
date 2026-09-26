import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';
import { UserRole } from './core/models/enums';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [authGuard]
  },
  {
    path: 'applications',
    loadComponent: () => import('./applications/applications-list/applications-list.component').then(m => m.ApplicationsListComponent),
    canActivate: [authGuard, roleGuard([UserRole.CREDIT_ADVISOR])]
  },
  {
    path: 'applications/new',
    loadComponent: () => import('./applications/application-form/application-form.component').then(m => m.ApplicationFormComponent),
    canActivate: [authGuard, roleGuard([UserRole.CREDIT_ADVISOR])]
  },
  {
    path: 'risk',
    loadComponent: () => import('./risk/risk-list/risk-list.component').then(m => m.RiskListComponent),
    canActivate: [authGuard, roleGuard([UserRole.ANALYST])]
  },
  {
    path: 'risk/:id',
    loadComponent: () => import('./risk/risk-detail/risk-detail.component').then(m => m.RiskDetailComponent),
    canActivate: [authGuard, roleGuard([UserRole.ANALYST])]
  },
  {
    path: 'disbursements',
    loadComponent: () => import('./disbursements/disbursements-list/disbursements-list.component').then(m => m.DisbursementsListComponent),
    canActivate: [authGuard, roleGuard([UserRole.OPERATIONS_AGENT])]
  },
  {
    path: 'disbursements/:id',
    loadComponent: () => import('./disbursements/disbursement-form/disbursement-form.component').then(m => m.DisbursementFormComponent),
    canActivate: [authGuard, roleGuard([UserRole.OPERATIONS_AGENT])]
  },
  {
    path: 'payments',
    loadComponent: () => import('./payments/payments-search/payments-search.component').then(m => m.PaymentsSearchComponent),
    canActivate: [authGuard, roleGuard([UserRole.OPERATIONS_AGENT])]
  },
  { path: '**', redirectTo: '/login' }
];
