import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import {routing} from "./app.routing";
import { AppComponent }   from './app.component';
import {LoginComponent} from "./principal-components/login-component/login.component";
import {HomeComponent} from "./principal-components/home-component/home.component";
import {MyCourses} from "./professor-components/my-courses.component";
import {ListOfProblems} from "./admin-components/list-of-problems.component";
import {CreateProblem} from "./general-components/create-problem/create-problem.component";
import { StudentComponentsComponent } from './student-components/student-components.component';
import { GenericTableComponent } from './general-components/generic-table/generic-table.component';
import { FilterPipe } from './pipes/filter.pipe';

import { FullbodyProblemComponent } from './general-components/create-problem/fullbody-problem.component';
import { FunctionbodyProblemComponent } from './general-components/create-problem/functionbody-problem.component';
import { TestCasesCreatorComponent } from './general-components/create-problem/test-cases-creator.component';

import { KeysPipe } from './pipes/keys.pipe';
import { FilterUsersPipe } from './pipes/filter-users.pipe';
import { FilterProblemsPipe } from './pipes/filter-problems.pipe';
import { FilterAssignmentsPipe } from './pipes/filter-assignments.pipe';
import { FilterSubmissionsPipe } from './pipes/filter-submissions.pipe';
import { FilterGroupsPipe } from './pipes/filter-groups.pipe';
import { FilterCoursesPipe } from './pipes/filter-courses.pipe';
import { FilterTopicsPipe } from './pipes/filter-topics.pipe';

@NgModule({
    imports:      [
        BrowserModule,
        FormsModule,
        routing
    ],
    declarations: [
        AppComponent,
        LoginComponent,
        HomeComponent,
        MyCourses,
        ListOfProblems,
        CreateProblem,
        StudentComponentsComponent,
        GenericTableComponent,
        FilterPipe,
        FullbodyProblemComponent,
        FunctionbodyProblemComponent,
        TestCasesCreatorComponent,
        KeysPipe,
        FilterUsersPipe,
        FilterProblemsPipe,
        FilterAssignmentsPipe,
        FilterSubmissionsPipe,
        FilterGroupsPipe,
        FilterCoursesPipe,
        FilterTopicsPipe
    ],
    bootstrap:    [ AppComponent ]
})
export class AppModule { }
