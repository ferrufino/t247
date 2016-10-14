import { ModuleWithProviders }  from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent }      from './principal-components/login-component/login.component';
import {HomeComponent} from "./principal-components/home-component/home.component";
import {AppComponent} from "./app.component";
import {ProfileComponent} from "./general-components/profile/profile.component";

const appRoutes: Routes = [
    {
        path: '',
        component: HomeComponent
    },
    {
        path: 'home',
        component: HomeComponent
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
      path: 'profile',
      component: ProfileComponent
    }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
