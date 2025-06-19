import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../services/auth.service';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const toastr = inject(ToastrService);

  if ((authService.isLoggedIn() && authService.isAdmin())) {
    return true;
  } else {
    router.navigate(['/']);
    toastr.error('Nie posiadasz uprawnień do przeglądania tej strony.', 'Błąd autoryzacji');
    return false;
  }
};
