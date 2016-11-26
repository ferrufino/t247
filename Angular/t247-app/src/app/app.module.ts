import {NgModule, CUSTOM_ELEMENTS_SCHEMA}      from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {routing} from "./app.routing";
import {HttpModule}    from '@angular/http';
import {AppComponent}   from './app.component';
import {LoginComponent} from "./principal-components/login-component/login.component";
import {HomeComponent} from "./principal-components/home-component/home.component";
import {TopicsDashboardComponent} from "./student-components/topics-dashboard/topics-dashboard.component";
import {ProfileComponent} from "./general-components/profile/profile.component";
import {ViewUsersComponent} from "./admin-components/view-users/view-users.component";
import {CreateProblem} from "./general-components/create-problem/create-problem.component";
import {StudentComponentsComponent} from './student-components/student-components.component';
import {GenericTableComponent} from './general-components/generic-table/generic-table.component';
import {GenericFormComponent} from './general-components/generic-table/generic-form.component';
import {Tab} from './general-components/tab/tab.component';
import {Tabs} from './general-components/tabs/tabs.component';
import {TabStatic} from './general-components/tab-static/tab-static.component';
import {TabsStatic} from './general-components/tabs-static/tabs-static.component';
import {TestCasesCreatorComponent} from './general-components/create-problem/test-cases-creator.component';
import {SubmitProblem}  from './general-components/submit-problem/submit-problem.component';
import {KeysPipe} from './pipes/keys.pipe';
import {FilterPipe} from './pipes/filter.pipe';
import {FilterUsersPipe} from './pipes/filter-users.pipe';
import {FilterProblemsPipe} from './pipes/filter-problems.pipe';
import {CapitalizePipe} from "./pipes/capitalize.pipe";
import {FilterAssignmentsPipe} from './pipes/filter-assignments.pipe';
import {FilterSubmissionsPipe} from './pipes/filter-submissions.pipe';
import {FilterAssignmentSubmissionsPipe} from './pipes/filter-assignment-submissions.pipe';
import {FilterGroupsPipe} from './pipes/filter-groups.pipe';
import {FilterCoursesPipe} from './pipes/filter-courses.pipe';
import {FilterTopicsPipe} from './pipes/filter-topics.pipe';
import {SortPipe} from './pipes/sort.pipe';
import {FirstLoginComponent} from './student-components/first-login.component';


import "materialize-css";
import {MaterializeModule} from "angular2-materialize";

import {UsersService} from "./services/users.service";
import {CoursesService} from "./services/courses.service";
import {GroupsService} from "./services/groups.service";
import {TopicsService} from "./services/topics.service";
import {SubmitProblemService} from "./services/submit-problem.service";
import {AssignmentsService} from "./services/assignments.service";
import {ProblemsService} from "./services/problems.service";
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

import {AssignmentFormComponent} from "./professor-components/group/assignment-form/assignment-form.component";
import {ProblemDetailsComponent} from "./general-components/problem-details/problem-details.component";
import { PolymerElement } from '@vaadin/angular2-polymer';
import {GroupFormComponent} from "./professor-components/group/group-form/group-form.component";
import {FeedbackCardComponent} from "./general-components/feedback-card/feedback-card.component";

import {RoleChangeService} from './services/role-change.service';
import {AuthService} from "./services/auth.service";

import {AdminHomeComponent} from "./admin-components2/admin-home/admin-home.component";
import {AdminGuard} from "./services/admin.guard";

import {ProfessorHomeComponent} from "./professor-components-2/professor-home/professor-home.component";
import {ProfessorGuard} from "./services/professor.guard";

import {StudentHomeComponent} from "./student-components-2/student-home/student-home.component";
import {StudentGuard} from "./services/student.guard";

import {LoginGuard} from "./services/login.guard";
import {RootGuard} from "./services/root.guard";

import {AdminProfileWrapperComponent} from "./general-components/admin-profile-wrapper/admin-profile-wrapper.component";
import {ProfessorProfileWrapperComponent} from "./general-components/professor-profile-wrapper/professor-profile-wrapper.component";
import {StudentProfileWrapperComponent} from "./general-components/student-profile-wrapper/student-profile-wrapper.component";

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
        TopicsDashboardComponent,
        CreateProblem,
        SubmitProblem,
        EditorComponent,
        ProfileComponent,
        ViewUsersComponent,
        StudentComponentsComponent,
        GenericTableComponent,
        GenericFormComponent,
        Tab,
        Tabs,
        TabStatic,
        TabsStatic,
        CapitalizePipe,
        FilterPipe,
        TestCasesCreatorComponent,
        KeysPipe,
        FilterUsersPipe,
        FilterProblemsPipe,
        FilterAssignmentsPipe,
        FilterAssignmentSubmissionsPipe,
        FilterSubmissionsPipe,
        FilterGroupsPipe,
        FilterCoursesPipe,
        FilterTopicsPipe,
        SortPipe,
        FirstLoginComponent,
        TopicsEditComponent,
        CoursesEditComponent,
        GroupComponent,
        AssignmentComponent,
      ProblemDetailsComponent,
        UserEditComponent,
        SiteNavbarComponent,
        PolymerElement('vaadin-date-picker'),
        AssignmentFormComponent,
        GroupFormComponent,
        FeedbackCardComponent,
        AdminHomeComponent,
        ProfessorHomeComponent,
        StudentHomeComponent,
        AdminProfileWrapperComponent,
        ProfessorProfileWrapperComponent,
        StudentProfileWrapperComponent
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
      AssignmentsService,
      ProblemsService,
      RoleChangeService,
      AuthService,
      AdminGuard,
      ProfessorGuard,
      StudentGuard,
      LoginGuard,
      RootGuard
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]

})
export class AppModule {
}
