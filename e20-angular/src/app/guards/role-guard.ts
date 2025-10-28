import {CanActivateFn, Router} from '@angular/router';
import {inject} from '@angular/core';
import {AuthService} from '../services/auth-service';

export const roleGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const user = authService.getUser();

  if (!user) {
    router.navigate(['/access-denied']);
    return false;
  }

  const roles = user?.roles || [];

  if (roles.includes('ADMIN') || roles.includes('MANAGER')) {
    console.log("ACCESS GRANTED\n")
    return true;
  }

  console.log("ACCESS DENIED");
  router.navigate(['/access-denied']);

  return false;
};
