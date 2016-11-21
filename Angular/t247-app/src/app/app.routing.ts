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

import {AdminHomeComponent} from "./admin-components2/admin-home/admin-home.component";
import {AdminGuard} from "./services/admin.guard";

import {ProfessorHomeComponent} from "./professor-components-2/professor-home/professor-home.component";
import {ProfessorGuard} from "./services/professor.guard";

import {StudentHomeComponent} from "./student-components-2/student-home/student-home.component";
import {StudentGuard} from "./services/student.guard";

import {LoginGuard} from "./services/login.guard";
import {RootGuard} from "./services/root.guard";

const appRoutes: Routes = [
    // TODO sendtoHome
    {
        path: '',
        component: AppComponent,
        canActivate: [RootGuard]
    },
    {
        path: 'admin/:tab',
        component: AdminHomeComponent,
        canActivate: [AdminGuard]
    },
    {
        path: 'admin',
        component: AdminHomeComponent,
        canActivate: [AdminGuard]
    },
    {
        path: 'professor/:tab',
        component: ProfessorHomeComponent,
        canActivate: [ProfessorGuard]
    },
    {
        path: 'professor',
        component: ProfessorHomeComponent,
        canActivate: [ProfessorGuard]
    },
    {
        path: 'student/:tab',
        component: StudentHomeComponent,
        canActivate: [StudentGuard]
    },
    {
        path: 'student',
        component: StudentHomeComponent,
        canActivate: [StudentGuard]
    },
    {
        path: 'login',
        component: LoginComponent,
        canActivate: [LoginGuard]
    },
    {
      path: 'profile',
      component: ProfileComponent,
      canActivate: [StudentGuard]
    },
    // TODO  groupsGuard
    {
      path: 'groups/:id',
      component: GroupComponent,
      resolve : {
        any: GroupResolve
      },

    },
    {
        path: 'submitProblem/:id',
        component: SubmitProblem,
        canActivate: [StudentGuard]
    },
    {
        path: 'problem/:id',
        component: ProblemDetailsComponent,
        canActivate: [ProfessorGuard]
    },
    {
        path: 'createProblem',
        component: CreateProblem,
        canActivate: [ProfessorGuard]
    }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
