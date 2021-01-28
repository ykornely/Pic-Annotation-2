import { Routes } from '@angular/router';
import { UserComponent } from './user/user.component';
import { SignUpComponent } from './user/sign-up/sign-up.component';
import { SignInComponent } from './user/sign-in/sign-in.component';
import { PictureComponent } from './picture/picture.component';
import { AuthGuard } from './auth/auth.guard';

export const appRoutes: Routes = [
    {
        path: 'signup', component: UserComponent, // when nevigated here, load user component inside app.component.html's router-outlet, and inside the user.component.html's router-outlet, load the children html (sign-up.component.html. see one row below)
        children: [{ path: '', component: SignUpComponent }]
    },
    {
        path: 'login', component: UserComponent,
        children: [{ path: '', component: SignInComponent }]
    },
    {
        path: 'pictures', component: PictureComponent, canActivate:[AuthGuard]
    },
    {
       path: '', redirectTo: '/login', pathMatch: 'full'
    }
]; // imported