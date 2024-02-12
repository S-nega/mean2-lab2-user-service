import { Injectable } from '@angular/core';
import { HttpClient,  HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:3000/api/users';
  
  // users: any[] = []

  constructor(private http: HttpClient) { 
    // Users: UserService;

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
    console.log(user);
    return this.http.post<any>(`${this.apiUrl}/update/${userId}`, user).pipe(
      catchError(error => {
        console.error(error.error.message);
      
        console.error(error.error.message);
        return throwError(error.error.message);
      })
    );
  }

  deleteUser(userId: string): Observable <any> {
    return this.http.delete<any>(`${this.apiUrl}/del/${userId}`).pipe(
      catchError(error => {
        console.error(error.error.message);
      
        console.error(error.error.message);
        return throwError(error.error.message);
      })
    );
  }

  //authentication


}
