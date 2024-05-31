import { Component} from '@angular/core';
import { UserService } from '../user.service';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';


@Component({
  selector: 'app-user',
  templateUrl: './edit-user.component.html',
  // styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent {
  user: any;
  editUserForm: FormGroup

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private router: Router) 
    { 
      this.editUserForm = this.formBuilder.group({
        name: ['', Validators.required],
        age: [, Validators.required],
        email: ['', Validators.required],
        password: ['', Validators.required]
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
      if (this.editUserForm.valid && userId != null){
        const userData = this.editUserForm.value;
        this.userService.updateUser(userId, userData).subscribe(() => {
          this.router.navigate(['/user-list']);
        });
      }
      else{
        console.log("Error: uncorrect data")
      }
    });
  }

  onDelete(userId: string): void {
    if (confirm('Вы уверены, что хотите удалить пользователя?')) {
      this.userService.deleteUser(userId).subscribe(() => {
        this.logout();
      });
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
