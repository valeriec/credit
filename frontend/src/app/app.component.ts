import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, RouterLink } from '@angular/router';
import { AuthService } from './core/services/auth.service';
import { UserRole } from './core/models/enums';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  authService = inject(AuthService);
  private router = inject(Router);
  UserRole = UserRole;

  canAccessSolicitudes(role: UserRole): boolean {
    return role === UserRole.CREDIT_ADVISOR;
  }

  canAccessComiteRiesgo(role: UserRole): boolean {
    return role === UserRole.ANALYST;
  }

  canAccessDesembolsos(role: UserRole): boolean {
    return role === UserRole.OPERATIONS_AGENT;
  }

  canAccessPlanPagos(role: UserRole): boolean {
    return role === UserRole.OPERATIONS_AGENT;
  }

  getRoleName(role: UserRole): string {
    const roleNames = {
      [UserRole.CREDIT_ADVISOR]: 'Asesor de Crédito',
      [UserRole.ANALYST]: 'Analista',
      [UserRole.OPERATIONS_AGENT]: 'Agente de Operaciones',
    };
    return roleNames[role] || role;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
