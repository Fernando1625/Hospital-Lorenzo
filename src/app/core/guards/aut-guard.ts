import { CanActivateFn } from '@angular/router';

export const autGuard: CanActivateFn = (route, state) => {
  return true;
};
