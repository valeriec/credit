import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { map } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { UserRole } from '../models/enums';

export const roleGuard = (allowedRoles: UserRole[]): CanActivateFn => {
  return () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    return authService.currentUser$.pipe(
      map(user => {
        if (!user) {
          router.navigate(['/login']);
          return false;
        }

        if (allowedRoles.includes(user.role)) {
          return true;
        }

        // Redirigir al dashboard si no tiene permiso
        router.navigate(['/dashboard']);
        return false;
      })
    );
  };
};
