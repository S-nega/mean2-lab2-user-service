import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserComponent } from './user/user.component';
import { AddUserComponent } from './add-user/add-user.component';
import { AuthUserComponent } from './auth-user/auth-user.component';
import { UserListComponent } from './user-list/user-list.component';
import { EditUserComponent } from './edit-user/edit-user.component';
import { AuthGuard } from './auth.guard';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { NewsComponent } from './news/news.component';

const routes: Routes = [
  { path: '', redirectTo: 'user-list', pathMatch: 'full' },
  { path: 'news/:city', component: NewsComponent },
  { path: 'news', component: NewsComponent },
  { path: 'news/:id', component: NewsComponent },
  { path: 'user/:id', component: UserComponent },
  { path: 'edit-user/:id', component: EditUserComponent, canActivate: [AuthGuard]  },
  { path: 'add-user', component: AddUserComponent },//registration
  { path: 'auth-user', component: AuthUserComponent },
  { path: 'user-list', component: UserListComponent },
  { path: 'file-upload', component: FileUploadComponent },
  { path: 'users', loadChildren: () => import('./modules/usermodule').then(m => m.UserModule) },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
