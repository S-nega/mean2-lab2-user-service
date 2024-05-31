import { Injectable } from '@angular/core';
import { HttpClient,  HttpHeaders } from '@angular/common/http';
import { tap, map, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:3000/api/users';
  private newsUrl = 'http://localhost:3000/api/news';
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
    return currentUserId;      
  }

  isUserAuth(){
    var result = true;
    if(this.getCurrentUserId() == 'null') {
      result = false;
    }
    return result;
  }

  getNews(city: string): Observable<any> {
    console.log("getNews");
    return this.http.get<any>(`http://localhost:3000/api/news/news/${city}`)//;//4000
    // .pipe(
    //   catchError(error => {
    //     console.error(error.error.message);
    //     return throwError(error.error.message);
    //   })
    // );
  }

  // getTasks(): Observable<any[]> {
  //   return this.http.get<any[]>(this.tasksUrl).pipe(
  //     catchError(error => {
  //       console.error(error.error.message);
  //       return throwError(error.error.message);
  //     })
  //   );
  // }

  //
  // addTask(task: any): Observable<any> {
  //   return this.http.post<any>(`${this.tasksUrl}/add`, task).pipe(
  //     catchError(
  //       error => {
  //         console.error(error.error.message);
  //         return throwError(error.error.message);
  //       }),
  //     tap(response => {
  //       // Дополнительная проверка на успешное выполнение запроса
        
  //       if (response.success) {
  //         // const email = req.body.email;
  //         // await sendEmail(email, 'Registration Successful', 'You have successfully registered.');
  //         // res.send('User registered successfully');
  //         // Действия при успешном выполнении
  //         console.log('User added successfully');
  //       }
  //     })
  //   );
  // }


  // addUserToFriend(userId: string){
  //   if(this.getCurrentUserId() == 'null') {
  //     this.getCurrentUserId().friends.push(userId);
  //     await currentUser.save();
  //   }
  // } 

  // addUserToFriend(userId: string){
  //   if(this.getCurrentUserId() != 'null') {
  //     return this.http.post<any>(`${this.apiUrl}/addFriend`, this.currentUserId).pipe(//, userId
  //       catchError(
  //         error => {
  //           console.error(error.error.message);
  //           return throwError(error.error.message);
  //         })
  //         // ,
  //       // tap(response => {
  //       //   // Дополнительная проверка на успешное выполнение запроса
          
  //       //   // if (response.success) {
  //       //   //   // const email = req.body.email;
  //       //   //   // await sendEmail(email, 'Registration Successful', 'You have successfully registered.');
  //       //   //   // res.send('User registered successfully');
  //       //   //   // Действия при успешном выполнении
  //       //   //   console.log('Friend added successfully');
  //       //   // }
  //       // })
  //     );
  //   }
  // }

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
      catchError(
        error => {
          console.error(error.error.message);
          return throwError(error.error.message);
        }),
      tap(response => {
        // Дополнительная проверка на успешное выполнение запроса
        
        if (response.success) {
          // const email = req.body.email;
          // await sendEmail(email, 'Registration Successful', 'You have successfully registered.');
          // res.send('User registered successfully');
          // Действия при успешном выполнении
          console.log('User added successfully');
        }
      })
    );
  }

  authUser(email: string, password: string) {
    return this.http.post<any>(`${this.apiUrl}/auth`, { email, password }).pipe(
      tap(response => {
        if (response && response.token && response.currentUserId) {
          this.token = response.token;
          this.currentUserId = response.currentUserId;
          localStorage.setItem('token', this.token);
          localStorage.setItem('currentUserId', this.currentUserId);
        }
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
      return this.http.post<any>(`${this.apiUrl}/update/${userId}`, user)
    } else {
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

  deleteFile(filename: string) {
    return this.http.delete(`http://localhost:3000/upload/${filename}`)
    .pipe(
      catchError(error => {
        console.error(error.error.message);
        return throwError(error.error.message);
      })
    );
  }

  uploadFile(file: any): Observable<any> {
    console.log("user-service: ");
    return this.http.post<any>('http://localhost:3000/upload', file).pipe(
      catchError(
        error => {
          console.error(error.error.message);
          return throwError(error.error.message);
        }),
      tap(response => {
        console.log("user-service: ");

        // Дополнительная проверка на успешное выполнение запроса
        
        if (response.success) {
          // Действия при успешном выполнении
          console.log('file added successfully');
        }
      })
    );
  }

  getFilesList(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:3000/upload').pipe(
      catchError(error => {
        console.error(error.error.message);
        return throwError(error.error.message);
      })
    )
  }
}
