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

import {SubmissionsOfAssignmentComponent} from "./professor-components/submissions/submissions.component";
import {AdminProfileWrapperComponent} from "./general-components/admin-profile-wrapper/admin-profile-wrapper.component";
import {ProfessorProfileWrapperComponent} from "./general-components/professor-profile-wrapper/professor-profile-wrapper.component";
import {StudentProfileWrapperComponent} from "./general-components/student-profile-wrapper/student-profile-wrapper.component";

const appRoutes: Routes = [
    {
        path: '',
        component: AppComponent,
        canActivate: [RootGuard]
    },
    {
        path: 'admin/tab/:tab',
        component: AdminHomeComponent,
        canActivate: [AdminGuard]
    },
    {
        path: 'admin',
        component: AdminHomeComponent,
        canActivate: [AdminGuard]
    },
    {
        path: 'professor/tab/:tab',
        component: ProfessorHomeComponent,
        canActivate: [ProfessorGuard]
    },
    {
        path: 'professor',
        component: ProfessorHomeComponent,
        canActivate: [ProfessorGuard]
    },
    {
        path: 'student',
        component: StudentHomeComponent,
        canActivate: [StudentGuard]
    },
    {
        path: 'student/tab/:tab',
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
    // FALTA GUARD PARA EVITAR QUE SE ACCEDA UN PROBLEMA INEXISTENTE
    {
        path: 'problem/:id',
        component: ProblemDetailsComponent,
        canActivate: [ProfessorGuard]
    },
    {
        path: 'createProblem',
        component: CreateProblem,
        canActivate: [ProfessorGuard]
    },
    // FALTA GUARD PARA EVITAR QUE SE ACCEDA UN GRUPO INEXISTENTE O QUE NO LE PERTENECE
    {
      path: 'professor/groups/:id',
      component: GroupComponent,
      resolve : {
        any: GroupResolve
      },
      canActivate: [ProfessorGuard]
    },
    // FALTA GUARD PARA EVITAR QUE SE ACCEDA UN PROBLEMA INEXISTENTE O INACTIVO
    {
        path: 'student/submitProblem/:id',
        component: SubmitProblem,
        canActivate: [StudentGuard]
    },
    {
        path: 'professor/student-attempts/:assig_id/:student_id',
        component: SubmissionsOfAssignmentComponent,
        canActivate: [ProfessorGuard]

    },
    {
        path: '**',
        component: AppComponent,
        canActivate: [RootGuard]
    }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
