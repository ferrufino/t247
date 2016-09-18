/**
 * Created by ahinojosa on 13/09/16.
 */

import {Component} from '@angular/core';
import {AuthenticationService} from '../services/authentication.service'

@Component({
    selector: 'login-form',
    providers: [AuthenticationService],
    template: `
            <ul id="dropdownUser" class="dropdown-content">
              <li><a href="#!">Profile</a></li>
              <li class="divider"></li>
              <li><a href="#!">Admin</a></li>
              <li><a href="#!">Prof</a></li>
              <li><a href="#!">Student</a></li>
            </ul>
            <ul id="dropdownMobile" class="dropdown-content">
              <li><a href="#!">Profile</a></li>
              <li class="divider"></li>
              <li><a href="#!">Admin</a></li>
              <li><a href="#!">Prof</a></li>
              <li><a href="#!">Student</a></li>
            </ul>
            <nav>
              <div class="nav-wrapper">
                <a href="#" class="brand-logo">T247</a>
                <a href="#" data-activates="mobile-demo" class="button-collapse"><i class="material-icons">menu</i></a>
                <ul class="right hide-on-med-and-down">
                  <li><a href="sass.html">Sass</a></li>
                  <li><a href="badges.html">Components</a></li>
                  <li><a href="collapsible.html">JavaScript</a></li>
                  <!-- Dropdown Trigger -->
                  <li><a class="dropdown-button" href="#!" data-activates="dropdownUser">{{userName}}<i class="material-icons right">arrow_drop_down</i></a></li>
                  <li><a (click)="logout()" href="#">Logout</a></li>
                </ul>
                <ul class="side-nav" id="mobile-demo">
                  <li><a href="sass.html">Sass</a></li>
                  <li><a href="badges.html">Components</a></li>
                  <li><a href="collapsible.html">JavaScript</a></li>
                  <!-- Dropdown Trigger -->
                  <li><a class="dropdown-button-mobile" href="#!" data-activates="dropdownMobile">{{userName}}<i class="material-icons right">arrow_drop_down</i></a></li>
                  <li><a (click)="logout()" href="#">Logout</a></li>
                </ul>
              </div>
            </nav>
            <div class="container" >
              <div class="content">
                <span>Congratulations, you have successfully logged in!!</span>
              </div>
            </div>
    	`
})

export class HomeComponent {

    constructor(
        private _service:AuthenticationService){}

    ngOnInit(){
        this._service.checkCredentials();
        $(".dropdown-button").dropdown();
        $(".dropdown-button-mobile").dropdown();
        $(".button-collapse").sideNav();
    }

    logout() {
        this._service.logout();
    }

    userName = JSON.parse(localStorage.getItem("user")).email;
}
