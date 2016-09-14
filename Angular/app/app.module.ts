import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import {routing} from "./app.routing";

import { AppComponent }   from './app.component';
import {LoginComponent} from "./principal-components/login.component";
import {HomeComponent} from "./principal-components/home.component";

@NgModule({
    imports:      [
        BrowserModule,
        FormsModule,
        routing
    ],
    declarations: [
        AppComponent,
        LoginComponent,
        HomeComponent
    ],
    bootstrap:    [ AppComponent ]
})
export class AppModule { }
