import { Injectable } from '@angular/core';
import { HttpClient,  HttpHeaders } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:3000/api/users';
  private token: string = '';

  constructor(private http: HttpClient) { 
    this.token = localStorage.getItem('token') || '';
  }

  getAuthToken() {//use everywhere for checking
    console.log("getAuthToken" + this.token);
    return this.token || localStorage.getItem('token');
  }

  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      catchError(error => {
        console.error(error.error.message);
      
        console.error(error.error.message);
        return throwError(error.error.message);
      })
    );
  }

  //registration
  addUser(user: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/reg`, user).pipe(
      catchError(error => {
        console.error(error.error.message);
      
        console.error(error.error.message);
        return throwError(error.error.message);
      })
    );
  }

  //authorization
  // authUser(email: string, password: string) {
  //   return this.http.post(`${this.apiUrl}/auth`, { email, password }).pipe(
  //     catchError(error => {
  //       console.error(error.error.message);
      
  //       console.error(error.error.message);
  //       return throwError(error.error.message);
  //     })
  //   );
  // }

  authUser(email: string, password: string) {
    return this.http.post<any>(`${this.apiUrl}/auth`, { email, password }).pipe(
      tap(response => {
        if (response && response.token) {
          this.token = response.token;
          console.log('/service/authUser/response');
          localStorage.setItem('token', this.token);
        }
        console.log('/service/authUser/un response');
      })
    );
  }

  logout() {
    this.token = '';
    localStorage.removeItem('token');
  }

  getOneUser(userId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${userId}`).pipe(
      catchError(error => {
        console.error(error.error.message);
      
        console.error(error.error.message);
        return throwError(error.error.message);
      })
    );
  }

  updateUser(userId: string, user: any): Observable<any> {
    if (this.token) {
      console.log("updateUser token !== null")
      // делайте что-то с токеном
    } else {
      console.log("service.ts/updateuser/token == null")
      // обработка ситуации, когда токен отсутствует
    }
    console.log(user);
    return this.http.post<any>(`${this.apiUrl}/update/${userId}`, user).pipe(
      catchError(error => {
        console.error(error.error.message);
        return throwError(error.error.message);
      })
    );
  }

  deleteUser(userId: string): Observable <any> {
    return this.http.delete<any>(`${this.apiUrl}/del/${userId}`).pipe(
      catchError(error => {
        console.error(error.error.message);
        return throwError(error.error.message);
      })
    );
  }
}
