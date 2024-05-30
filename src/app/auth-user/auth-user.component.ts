import { Component } from '@angular/core';
import { UserService } from '../user.service';
import { FormBuilder, FormGroup,  Validators  } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth-user',
  templateUrl: './auth-user.component.html',
  // styleUrls: ['./auth-user.component.css']
})
export class AuthUserComponent {
  authUserForm: FormGroup
  // newUser: Users = { name: '', age: null, email: '' };

  constructor(
    private userService: UserService,
    private formBuilder: FormBuilder,
    private router: Router
  ) { 
    this.authUserForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    })
  }

  onSubmit(): void {
    console.log('auth-user.component authUserForm')
    if (this.authUserForm){
      console.log('auth-user.component valid')
      const { email, password } = this.authUserForm.value;
      this.userService.authUser(email, password).subscribe(
        (response) => {
          console.log('Logged in successfully');
          this.router.navigate(['/user-list']);
          // Редирект или другие действия при успешной авторизации
        },
        (error) => {
          console.error('Error:', error.error.message);
          this.router.navigate(['/auth-user']);
          // Вернуться на страницу авторизации или показать сообщение об ошибке
        }
      );
    }
  }
  
  logout(): void{
    this.userService.logout();
  }

  isUserAuth(): boolean{
    return this.userService.isUserAuth();
  }

  getCurrentUserId(): string{
    return this.userService.getCurrentUserId();
  }
}
