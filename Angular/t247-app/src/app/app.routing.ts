import { ModuleWithProviders }  from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent }      from './principal-components/login-component/login.component';
import {HomeComponent} from "./principal-components/home-component/home.component";
import {AppComponent} from "./app.component";
import {ProfileComponent} from "./general-components/profile/profile.component";
import {TopicsEditComponent} from "./admin-components/topics-edit/topics-edit.component";
import {CoursesEditComponent} from "./admin-components/courses-edit/courses-edit.component";
import {GroupComponent} from "./professor-components/group/group.component";
import { GroupResolve }   from "./services/group-resolve.service";


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
    },
    {
      path: 'editTopic/:id',
      component: TopicsEditComponent
    },
    {
      path: 'editCourse/:id',
      component: CoursesEditComponent
    },
    {
      path: 'groups/:id',
      component: GroupComponent,
      resolve : {
        any: GroupResolve
      }
    }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
