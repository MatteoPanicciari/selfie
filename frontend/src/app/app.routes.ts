import { Routes } from '@angular/router';
import { LoginComponent } from './component/login/login.component';
import { SelfieComponent } from './component/selfie/selfie.component';
import { authGuard } from './auth/auth.guard';
import { HomeComponent } from './component/selfie/component/home/home.component';
import { CalendarioComponent } from './component/selfie/component/calendario/calendario.component';

export const routes: Routes = [
    {path: 'login', component: LoginComponent},
    {path: '', component: SelfieComponent, canActivate:[authGuard], children:[
        {path: '', component: HomeComponent},
        {path: 'calendario', component: CalendarioComponent}
    ]},
    {path: '**', redirectTo:''}
];
