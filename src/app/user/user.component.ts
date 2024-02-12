import { Component} from '@angular/core';
import { UserService } from '../user.service';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';


@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent {
  user: any;
  editUserForm: FormGroup

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private router: Router) 
    { 
      this.editUserForm = this.formBuilder.group({
        name: [''],
        age: [],
        email: ['']
      })
    }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {

      const userId = params.get('id'); // Получаем userId из параметров маршрута
      if (userId != null ){
        this.userService.getOneUser(userId).subscribe((userData: any) => {
          this.user = userData; // Сохраняем данные пользователя
        });
      }
      else{
        console.log("Error: userId is null")
      }
    });
  }

  onSubmit(): void {
    this.route.paramMap.subscribe(params => {
      const userId = params.get('id'); // Получаем userId из параметров маршрута
      console.log(this.editUserForm.value.name);
      if (this.editUserForm.valid && userId != null){
        const userData = this.editUserForm.value;
        this.userService.updateUser(userId, userData).subscribe(updatedUser => {
          console.log('User updated successfully:', updatedUser);
          this.router.navigate(['/user-list']); //, userId
        });
      }
      else{
        console.log("Error: uncorrect data")
      }
    });
  }
}
