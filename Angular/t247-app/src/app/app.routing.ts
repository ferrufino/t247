import { ModuleWithProviders }  from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent }      from './principal-components/login-component/login.component';
import {AppComponent} from "./app.component";
import {ProfileComponent} from "./general-components/profile/profile.component";
import {GroupComponent} from "./professor-components/group/group.component";
import { GroupResolve }   from "./services/group-resolve.service";
import {SubmitProblem} from "./general-components/submit-problem/submit-problem.component";
import {ProblemDetailsComponent} from "./general-components/problem-details/problem-details.component";
import {CreateProblem} from "./general-components/create-problem/create-problem.component";


import {AdminHomeComponent} from "./admin-components/admin-home/admin-home.component";
import {AdminGuard} from "./services/admin.guard";

//import {ProfessorHomeComponent} from "./professor-components-2/professor-home/professor-home.component";
import {ProfessorHomeComponent} from "./professor-components/professor-home/professor-home.component";
import {ProfessorGuard} from "./services/professor.guard";

import {StudentHomeComponent} from "./student-components/student-home/student-home.component";
import {StudentGuard} from "./services/student.guard";

import {LoginGuard} from "./services/login.guard";
import {RootGuard} from "./services/root.guard";


import {SubmissionsOfAssignmentComponent} from "./professor-components/submissions/submissions.component";

import {SubmitProblemGuard} from "./services/submit-problem.guard";
import {TopicGuard} from "./services/topic.guard";


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
        path: 'student/tab/:tab/:topic',
        component: StudentHomeComponent,
        canActivate: [TopicGuard]
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
        canActivate: [SubmitProblemGuard]
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
