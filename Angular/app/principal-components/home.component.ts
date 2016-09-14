/**
 * Created by ahinojosa on 13/09/16.
 */

import {Component} from '@angular/core';
import {AuthenticationService} from '../services/authentication.service'
import {Route, Router} from "@angular/router";

@Component({
    selector: 'login-form',
    providers: [AuthenticationService],
    template: `
            <div class="container" >
                <div class="content">
                    <span>Congratulations, you have successfully logged in!!</span>
                    <br />
                    <a routerLink="/myAssignments">Click Here to My Assignments</a>
                    <a (click)="logout()" href="#">Click Here to logout</a>
                </div>
            </div>
    	`
})

export class HomeComponent {

    constructor(
        private _service: AuthenticationService,
        private _router: Router){}

    ngOnInit(){
        this._service.checkCredentials();
    }

    logout() {
        this._service.logout();
    }
}