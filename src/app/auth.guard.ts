// auth.guard.ts

import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})

class PermissionsService {

  constructor(
    private router: Router,
    private userService: UserService) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.userService.getAuthToken()) {
      console.log("true")
      console.log("guard " + this.userService.getAuthToken())
      return true; // Если токен присутствует, разрешаем доступ
    } else {
      this.router.navigate(['/auth-user']); // Если токен отсутствует, перенаправляем на страницу авторизации
      console.log("false")
      return false;
    }
      //your logic goes here
  }
}

export const AuthGuard: CanActivateFn = (next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean => {
  return inject(PermissionsService).canActivate(next, state);
}

// export class AuthGuard implements CanActivate {

//   constructor(private userService: UserService, private router: Router) {}

//   canActivate(): boolean {
//     if (this.userService.getAuthToken() !== '') {
//       return true; // Если токен присутствует, разрешаем доступ
//     } else {
//       this.router.navigate(['/auth-user']); // Если токен отсутствует, перенаправляем на страницу авторизации
//       return false;
//     }
//   }
// }
