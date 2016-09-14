/**
 * Created by ahinojosa on 13/09/16.
 */
import { ModuleWithProviders }  from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent }      from './principal-components/login.component';
import {HomeComponent} from "./principal-components/home.component";
import {AppComponent} from "./app.component";
import {MyAssignments} from "./user-components/my-assignments.component";

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
        path: 'myAssignments',
        component: MyAssignments
    }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
