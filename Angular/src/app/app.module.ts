// built-in
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http'; // corresponding with user.service.ts
import { CommonModule } from '@angular/common';
// components
// import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UserComponent } from './user/user.component';
import { SignUpComponent } from './user/sign-up/sign-up.component';
import { SignInComponent } from './user/sign-in/sign-in.component';
// routes (exported in routes.ts)
import { appRoutes } from './routes';
import { UserService } from './shared/user.service';
// other
import { AuthGuard } from './auth/auth.guard';
import { AuthInterceptor } from './auth/auth.interceptor';
import { PictureComponent } from './picture/picture.component';

@NgModule({
  declarations: [
    AppComponent,
    UserComponent,
    SignUpComponent,
    SignInComponent,
    PictureComponent
  ],
  imports: [
    BrowserModule,
    //AppRoutingModule, // could be removed later probably
    FormsModule,
    RouterModule.forRoot(appRoutes),
    HttpClientModule,
    CommonModule
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true
  },AuthGuard,UserService],
  bootstrap: [AppComponent]
})
export class AppModule { }
