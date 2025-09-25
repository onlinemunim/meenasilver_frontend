import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { NavbarService } from './Services/navbar.service';

export const authGuardGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const navbarService = inject(NavbarService);

  const token = localStorage.getItem('token');
  const userType = localStorage.getItem('user_type');

  if (!token) {
    router.navigate(['/login']);
    return false;
  }

  const requiredRole = route.data?.['role'] as string;
  if (requiredRole && userType !== requiredRole) {
    router.navigate(['/error-403']);
    return false;
  }

  return true;
};
