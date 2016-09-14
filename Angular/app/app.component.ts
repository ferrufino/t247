/**
 * Created by ahinojosa on 13/09/16.
 */

import {Component} from "@angular/core";
import {AuthenticationService} from './services/authentication.service';

@Component({
    selector: 'my-app',
    template: `
   <h1>{{title}}</h1>
   <router-outlet></router-outlet>
 `

})


export class  AppComponent {
    title = 'Tutoring 24/7';
}