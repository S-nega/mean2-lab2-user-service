import { UserService } from '../user.service';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent {

  users: any[] = []
  constructor(
    private userService: UserService,
    private router: Router
    ) { }

  ngOnInit(): void {
    this.userService.getUsers().subscribe((users: any) => {
      this.users = users;
    });
  }

  onDelete(userId: string): void {
    if (confirm('Вы уверены, что хотите удалить пользователя?')) {
      this.userService.deleteUser(userId).subscribe(() => {
        this.logout();
        this.userService.getUsers().subscribe((users: any) => {
          this.users = users;
        });
      });
    }
  }

  // addToFriend(userId: string): void{
  //   this.userService.addUserToFriend(userId);
  // }

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
