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
import {UserEditComponent} from "./admin-components/users-edit/users-edit.component";
import {SubmitProblem} from "./general-components/submit-problem/submit-problem.component";
import {FirstLoginComponent} from "./student-components/first-login.component";
import {ProblemDetailsComponent} from "./general-components/problem-details/problem-details.component";
import {CreateProblem} from "./general-components/create-problem/create-problem.component";

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
        path: 'firstLogIn',
        component: FirstLoginComponent
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
    },
    {
      path: 'editUser/:id',
      component: UserEditComponent
    },
    {
        path: 'submitProblem/:id',
        component: SubmitProblem
    },
    {
        path: 'problem/:id',
        component: ProblemDetailsComponent
    },
    {
        path: 'createProblem',
        component: CreateProblem
    }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
