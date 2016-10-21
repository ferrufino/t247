import {NgModule}      from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {routing} from "./app.routing";
import {HttpModule}    from '@angular/http';
import {AppComponent}   from './app.component';
import {LoginComponent} from "./principal-components/login-component/login.component";
import {HomeComponent} from "./principal-components/home-component/home.component";
import {MyCourses} from "./professor-components/my-courses.component";
import {ListOfProblems} from "./admin-components/list-of-problems.component";
import {TopicsDashboardComponent} from "./student-components/topics-dashboard/topics-dashboard.component";
import {SubmissionsComponent} from "./submissions/submissions.component";
import {ProfileComponent} from "./general-components/profile/profile.component";
import {ViewUsersComponent} from "./admin-components/view-users/view-users.component";
import {CreateProblem} from "./general-components/create-problem/create-problem.component";

import { StudentComponentsComponent } from './student-components/student-components.component';
import { GenericTableComponent } from './general-components/generic-table/generic-table.component';
import { Tab } from './general-components/tab/tab.component';
import { Tabs } from './general-components/tabs/tabs.component';
import { TestCasesCreatorComponent } from './general-components/create-problem/test-cases-creator.component';


import { KeysPipe } from './pipes/keys.pipe';
import { FilterPipe } from './pipes/filter.pipe';
import { FilterUsersPipe } from './pipes/filter-users.pipe';
import { FilterProblemsPipe } from './pipes/filter-problems.pipe';
import { FilterAssignmentsPipe } from './pipes/filter-assignments.pipe';
import { FilterSubmissionsPipe } from './pipes/filter-submissions.pipe';
import { FilterGroupsPipe } from './pipes/filter-groups.pipe';
import { FilterCoursesPipe } from './pipes/filter-courses.pipe';
import { FilterTopicsPipe } from './pipes/filter-topics.pipe';

import "materialize-css";
import {MaterializeModule} from "angular2-materialize";
import {CoursesService} from "./services/courses.service";
import {GroupsService} from "./services/groups.service";
import {TopicsService} from "./services/topics.service";

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    ReactiveFormsModule,
    routing,
    MaterializeModule
  ],
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    MyCourses,
    ListOfProblems,
    TopicsDashboardComponent,
    CreateProblem,
    SubmissionsComponent,
    ProfileComponent,
    ViewUsersComponent,
    StudentComponentsComponent,
    GenericTableComponent,
    Tab,
    Tabs,
    FilterPipe,
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
  bootstrap: [AppComponent],
  providers: [CoursesService, GroupsService, TopicsService]
})
export class AppModule {
}
