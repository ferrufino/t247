import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import {routing} from "./app.routing";
import { HttpModule }    from '@angular/http';

// Imports for loading & configuring the in-memory web api
import { InMemoryWebApiModule } from 'angular2-in-memory-web-api';
import { InMemoryDataService }  from './services/authentication.service';

import { AppComponent }   from './app.component';
import {LoginComponent} from "./principal-components/login.component";
import {HomeComponent} from "./principal-components/home.component";
import {MyAssignments} from "./user-components/my-assignments.component";
import {MyCourses} from "./professor-components/my-courses.component";
import {ListOfProblems} from "./admin-components/list-of-problems.component";
import {TopicsDashboard} from "./principal-components/topics-dashboard.component";

@NgModule({
    imports:      [
        BrowserModule,
        FormsModule,
        HttpModule,
        InMemoryWebApiModule.forRoot(InMemoryDataService),
        routing
    ],
    declarations: [
        AppComponent,
        LoginComponent,
        HomeComponent,
        MyAssignments,
        MyCourses,
        ListOfProblems,
        TopicsDashboard
    ],
    bootstrap:    [ AppComponent ]
})
export class AppModule { }
