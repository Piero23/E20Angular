import { CanActivateFn, Router } from '@angular/router';
import {inject} from '@angular/core';
import {AuthService} from '../services/auth-service';
import { AccessDenied } from '../shared/access-denied/access-denied';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const user = authService.getUser();

  if (!user) {
    router.navigate(['/access-denied']);
    return false;
  }

  const roles = user?.roles || [];

  if (roles.includes('ADMIN') || roles.includes('MANAGER')) {
    console.log("ACCESS GRANTED\n" + roles)
    return true;
  }

  console.log("ACCESS DENIED");
  router.navigate(['/access-denied']);

  return false;
};
