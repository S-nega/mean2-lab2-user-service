import { Injectable } from '@angular/core';
import { HttpClient,  HttpHeaders } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:3000/api/users';
  private token: string = '';
  private currentUserId: string = '';

  constructor(
    private http: HttpClient,
    private router: Router
    ) { 
    this.token = localStorage.getItem('token') || '';
  }

  getAuthToken() {//use everywhere for checking
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return token;
  }
  
  getCurrentUserId() {//use everywhere for checking
    var currentUserId = localStorage.getItem('currentUserId');
    if (currentUserId == null){
      currentUserId = 'null';
    }
    console.log(currentUserId);
    return currentUserId;      
  }

  isUserAuth(){
    var result = true;
    if(this.getCurrentUserId() == 'null') {
      result = false;
    }
    return result;
  }

  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      catchError(error => {
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
        return throwError(error.error.message);
      })
    );
  }

  authUser(email: string, password: string) {
    return this.http.post<any>(`${this.apiUrl}/auth`, { email, password }).pipe(
      tap(response => {
        if (response && response.token && response.currentUserId) {
          this.token = response.token;
          this.currentUserId = response.currentUserId;
          // console.log('/service/authUser/response');
          localStorage.setItem('token', this.token);
          localStorage.setItem('currentUserId', this.currentUserId);
        }
        // console.log('/service/authUser/un response');
      })
    );
  }

  logout(){
    console.log("logout");
    this.token = '';
    this.currentUserId = '';
    localStorage.removeItem('token');
    localStorage.removeItem('currentUserId');
    this.router.navigate(['/auth-user']);
  }

  getOneUser(userId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${userId}`).pipe(
      catchError(error => {
        console.error(error.error.message);
        return throwError(error.error.message);
      })
    );
  }

  updateUser(userId: string, user: any): Observable<any> {
    if (this.getAuthToken()) {
      // console.log("updateUser token !== null")
      return this.http.post<any>(`${this.apiUrl}/update/${userId}`, user)
    } else {
      // console.log("service.ts/updateuser/token == null")
      this.router.navigate(['/auth-user']);
      return throwError("error.error.message");//??
    }
    console.log(user);
    return this.http.post<any>(`${this.apiUrl}/update/${userId}`, user)
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
