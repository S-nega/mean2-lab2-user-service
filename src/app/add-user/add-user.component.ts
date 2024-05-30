import { Component } from '@angular/core';
import { UserService } from '../user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-user',  
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']

})
export class AddUserComponent {
  addUserForm: FormGroup

  constructor(
    private userService: UserService,
    private formBuilder: FormBuilder,
    private router: Router
  ) { 
    this.addUserForm = this.formBuilder.group({
      name: ['', Validators.required],
      age: [, Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required]
    })
  }

  onSubmit(): void {
    if (this.addUserForm.valid){
      const userData = this.addUserForm.value;
      this.userService.addUser(userData).subscribe(
        newUser => {
          console.log('User added successfully:', newUser);
        },
        error => {
          console.error('Error adding user:', error);
          this.router.navigate(['/add-user']);
        }
      );
      this.router.navigate(['/auth-user']);

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
