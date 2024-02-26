import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserComponent } from './user/user.component';
import { AddUserComponent } from './add-user/add-user.component';
import { AuthUserComponent } from './auth-user/auth-user.component';
import { UserListComponent } from './user-list/user-list.component';
import { EditUserComponent } from './edit-user/edit-user.component';
import { AuthGuard } from './auth.guard';

const routes: Routes = [
  { path: '', redirectTo: 'user-list', pathMatch: 'full' },
  { path: 'user/:id', component: UserComponent },
  { path: 'edit-user/:id', component: EditUserComponent, canActivate: [AuthGuard]  },
  { path: 'add-user', component: AddUserComponent },//registration
  { path: 'auth-user', component: AuthUserComponent },
  { path: 'user-list', component: UserListComponent },
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
