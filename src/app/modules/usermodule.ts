import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from '../app-routing.module';
import { AppComponent } from '../app.component';
import { UserComponent } from '../user/user.component';
import { AddUserComponent } from '../add-user/add-user.component';
import { HttpClientModule,  HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthUserComponent } from '../auth-user/auth-user.component';
import { UserListComponent } from '../user-list/user-list.component';
import { AuthInterceptor } from '../auth.interceptor';
import { EditUserComponent } from '../edit-user/edit-user.component';

@NgModule({
  declarations: [
    UserComponent,
    AddUserComponent,
    AuthUserComponent,
    UserListComponent,
    EditUserComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AppRoutingModule, //Добавление AppRoutingModule для роутов
    HttpClientModule, // Добавление HttpClientModule в список импортируемых модулей
    ReactiveFormsModule
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }],
  bootstrap: [AppComponent]
})
export class UserModule { }
