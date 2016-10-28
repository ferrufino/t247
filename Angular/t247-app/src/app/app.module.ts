import {NgModule}      from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {routing} from "./app.routing";
import {HttpModule}    from '@angular/http';
import {AppComponent}   from './app.component';
import {LoginComponent} from "./principal-components/login-component/login.component";
import {HomeComponent} from "./principal-components/home-component/home.component";
import {ListOfProblems} from "./admin-components/list-of-problems.component";
import {TopicsDashboardComponent} from "./student-components/topics-dashboard/topics-dashboard.component";
import {ProfileComponent} from "./general-components/profile/profile.component";
import {ViewUsersComponent} from "./admin-components/view-users/view-users.component";
import {CreateProblem} from "./general-components/create-problem/create-problem.component";
import {StudentComponentsComponent} from './student-components/student-components.component';
import {GenericTableComponent} from './general-components/generic-table/generic-table.component';
import {Tab} from './general-components/tab/tab.component';
import {Tabs} from './general-components/tabs/tabs.component';
import {TestCasesCreatorComponent} from './general-components/create-problem/test-cases-creator.component';
import {SubmitProblem}  from './general-components/submit-problem/submit-problem.component';
import {KeysPipe} from './pipes/keys.pipe';
import {FilterPipe} from './pipes/filter.pipe';
import {FilterUsersPipe} from './pipes/filter-users.pipe';
import {FilterProblemsPipe} from './pipes/filter-problems.pipe';
import {FilterAssignmentsPipe} from './pipes/filter-assignments.pipe';
import {FilterSubmissionsPipe} from './pipes/filter-submissions.pipe';
import {FilterGroupsPipe} from './pipes/filter-groups.pipe';
import {FilterCoursesPipe} from './pipes/filter-courses.pipe';
import {FilterTopicsPipe} from './pipes/filter-topics.pipe';

import "materialize-css";
import {MaterializeModule} from "angular2-materialize";

import {UsersService} from "./services/users.service";
import {CoursesService} from "./services/courses.service";
import {GroupsService} from "./services/groups.service";
import {TopicsService} from "./services/topics.service";
import {SubmitProblemService} from "./services/submit-problem.service";
import {AssignmentsService} from "./services/assignments.service";

import {CacheService} from "ng2-cache/src/services/cache.service";


import {CoursesEditComponent} from "./admin-components/courses-edit/courses-edit.component";
import {TopicsEditComponent} from "./admin-components/topics-edit/topics-edit.component";
import {UserEditComponent} from "./admin-components/users-edit/users-edit.component";

import {MultiselectDropdownModule} from 'angular-2-dropdown-multiselect/src/multiselect-dropdown';
import {CodemirrorModule} from 'ng2-codemirror';
import {EditorComponent} from './general-components/code-editor/editor.component';
import {GroupComponent} from "./professor-components/group/group.component";
import {AssignmentComponent} from "./professor-components/assignment/assignment.component";
import {GroupResolve} from "./services/group-resolve.service";
import {SiteNavbarComponent} from "./principal-components/site-navbar-component/site-navbar.component";

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        ReactiveFormsModule,
        routing,
        MaterializeModule,
        MultiselectDropdownModule,
        CodemirrorModule
    ],
    declarations: [
        AppComponent,
        LoginComponent,
        HomeComponent,
        ListOfProblems,
        TopicsDashboardComponent,
        CreateProblem,
        SubmitProblem,
        EditorComponent,
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
        FilterTopicsPipe,
        TopicsEditComponent,
        CoursesEditComponent,
        GroupComponent,
        AssignmentComponent,
        UserEditComponent,
        SiteNavbarComponent
    ],
    bootstrap: [AppComponent],
    providers: [
      CoursesService,
      GroupsService,
      TopicsService,
      UsersService,
      CacheService,
      SubmitProblemService,
      GroupResolve,
      AssignmentsService
    ]
})
export class AppModule {
}
