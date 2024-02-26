// auth.guard.ts

import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private userService: UserService, private router: Router) {}

  canActivate(): boolean {
    if (this.userService.getAuthToken()) {
      return true; // Если токен присутствует, разрешаем доступ
    } else {
      this.router.navigate(['/auth-user']); // Если токен отсутствует, перенаправляем на страницу авторизации
      return false;
    }
  }
}
