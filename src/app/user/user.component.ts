import { Component} from '@angular/core';
import { UserService } from '../user.service';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';


@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  // styleUrls: ['./user.component.css']
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
        name: ['', Validators.required],
        age: [, Validators.required],
        email: ['', Validators.required],
        password: ['', Validators.required]
      })
    }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {

      const userId = params.get('id'); // Получаем userId из параметров маршрута
      if(userId === this.userService.getCurrentUserId()){
        this.router.navigate(['/edit-user/' + userId]);
      }
      else if (userId != null ){
        this.userService.getOneUser(userId).subscribe((userData: any) => {
          this.user = userData; // Сохраняем данные пользователя
        });
      }
      else{
        console.log("Error: userId is null")
        this.router.navigate(['/user-list']);
      }
    });
  }

  
  logout(): void{
    this.userService.logout();
  }

  isUserAuth(): boolean{
    return this.userService.isUserAuth();
  }
}
