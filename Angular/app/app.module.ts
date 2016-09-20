import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import {routing} from "./app.routing";

import { AppComponent }   from './app.component';
import {LoginComponent} from "./principal-components/login.component";
import {HomeComponent} from "./principal-components/home.component";
import {MyAssignments} from "./user-components/my-assignments.component";
import {MyCourses} from "./professor-components/my-courses.component";
import {ListOfProblems} from "./admin-components/list-of-problems.component";

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
        MyAssignments,
        MyCourses,
        ListOfProblems
    ],
    bootstrap:    [ AppComponent ]
})
export class AppModule { }
