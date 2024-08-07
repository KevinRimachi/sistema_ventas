import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

const isTokenExpired = (): boolean => {
  const expiresAt = localStorage.getItem('expires_at');
  return expiresAt ? new Date().getTime() > parseInt(expiresAt, 10) : true;
};

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('token');
  if (!token || isTokenExpired()) {
    // Remove token and expiration time if expired
    localStorage.removeItem('token');
    localStorage.removeItem('expires_at');
    router.navigate(['admin']);
    return false;
  }
  return true;
};
