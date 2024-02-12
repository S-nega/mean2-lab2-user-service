import { Component } from '@angular/core';
import { UserService } from '../user.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-user',  
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']

})
export class AddUserComponent {
  addUserForm: FormGroup
  // newUser: Users = { name: '', age: null, email: '' };

  constructor(
    private userService: UserService,
    private formBuilder: FormBuilder,
    private router: Router
  ) { 
    this.addUserForm = this.formBuilder.group({
      name: [''],
      age: [],
      email: ['']
    })
  }

  onSubmit(): void {
    if (this.addUserForm.valid){
      const userData = this.addUserForm.value;
      this.userService.addUser(userData).subscribe(newUser => {
        console.log('User added successfully:', newUser);
        // this.user = { name: '', age: null, email: '' };
        
      });
      this.router.navigate(['/user-list']);
    }
  }
}
