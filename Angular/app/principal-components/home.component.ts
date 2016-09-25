/**
 * Created by ahinojosa on 13/09/16.
 */

import {Component} from '@angular/core';
import {AuthenticationService} from '../services/authentication.service'
import {Route, Router} from "@angular/router";

@Component({
    selector: 'home',
    providers: [AuthenticationService],
    template: `
            <ul id="dropdownUser" class="dropdown-content">
              <li><a href="#!">Profile</a></li>
              <li class="divider"></li>
              <li *ngFor="let role of roles">
                <a (click)="changeSelectedRole(role)" href="#!">{{role}}</a>
              </li>
            </ul>
            <ul id="dropdownMobile" class="dropdown-content">
              <li><a href="#!">Profile</a></li>
              <li class="divider"></li>
              <li *ngFor="let role of roles">
                <a (click)="changeSelectedRole(role)" href="#!">{{role}}</a>
              </li>
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
                  <li><a class="dropdown-button" href="#!" data-activates="dropdownUser">{{selectedRole}}<i class="material-icons right">arrow_drop_down</i></a></li>
                  <li><a (click)="logout()" href="#">Logout</a></li>
                </ul>
                <ul class="side-nav" id="mobile-demo">
                  <li><a href="sass.html">Sass</a></li>
                  <li><a href="badges.html">Components</a></li>
                  <li><a href="collapsible.html">JavaScript</a></li>
                  <!-- Dropdown Trigger -->
                  <li><a class="dropdown-button-mobile" href="#!" data-activates="dropdownMobile">{{selectedRole}}<i class="material-icons right">arrow_drop_down</i></a></li>
                  <li><a (click)="logout()" href="#">Logout</a></li>
                </ul>
              </div>
            </nav>
            <div class="container" >
              <div class="content" [ngSwitch]="selectedRole">
                <topics-dashboard *ngSwitchCase="'user'"></topics-dashboard>
                <my-assignments *ngSwitchCase="'user'"></my-assignments>
                <list-of-problems *ngSwitchCase="'admin'"></list-of-problems>
                <my-courses *ngSwitchCase="'prof'"></my-courses>
              </div>
            </div>
    	`
})

export class HomeComponent {
    roles: [string]
    selectedRole : string
    constructor(
        private _service: AuthenticationService,
        private _router: Router){}

    ngOnInit(){
        this._service.checkCredentials();
        if(localStorage.getItem("user")){
          this.roles = JSON.parse(sessionStorage.getItem("user")).roles;
          this.selectedRole = JSON.parse(sessionStorage.getItem("user")).roles[0];
        }
      //  $(".dropdown-button").dropdown();
      //  $(".dropdown-button-mobile").dropdown();
      //  $(".button-collapse").sideNav();
    }

    logout() {
        this._service.logout();
    }

    changeSelectedRole(role){
      var index = this.roles.indexOf(role);
      this.selectedRole = this.roles[index];
    }
}
