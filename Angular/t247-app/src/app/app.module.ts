import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import {routing} from "./app.routing";
import { AppComponent }   from './app.component';
import {LoginComponent} from "./principal-components/login-component/login.component";
import {HomeComponent} from "./principal-components/home-component/home.component";
import {MyCourses} from "./professor-components/my-courses.component";
import {ListOfProblems} from "./admin-components/list-of-problems.component";
import {CreateProblem} from "./general-components/create-problem.component";
import { StudentComponentsComponent } from './student-components/student-components.component';
import { GenericTableComponent } from './general-components/generic-table/generic-table.component';
import { FilterPipe } from './pipes/filter.pipe';
import { KeysPipe } from './pipes/keys.pipe';
import { FilterArrayOfObjectsPipe } from './pipes/filter-array-of-objects.pipe';

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
        KeysPipe,
        FilterArrayOfObjectsPipe
    ],
    bootstrap:    [ AppComponent ]
})
export class AppModule { }
