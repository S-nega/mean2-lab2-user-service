import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { catchError, tap } from 'rxjs/operators';
import { UserService } from './user.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(
      private router: Router,
      private userService: UserService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log('Intercepted request:', request);
    
    const authToken = this.userService.getAuthToken();
    // console.log("interseptor: " + this.userService.getAuthToken());
    const authRequest = request.clone({
      setHeaders: {
        Authorization: `Bearer ${authToken}`
      }
    });

    return next.handle(authRequest).pipe(
      tap((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          console.log('Intercepted response:', event);
        }
      }),
        catchError((error: HttpErrorResponse) => {
          if (error.status === 401 || error.status === 403) { // Обработка ошибки "Unauthorized" или "Forbidden"
            // Выполнение перенаправления на страницу входа
            this.router.navigate(['/login']);
          }
          return throwError(error);
        })
    );
  }
}
