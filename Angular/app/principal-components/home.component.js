/**
 * Created by ahinojosa on 13/09/16.
 */
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var authentication_service_1 = require('../services/authentication.service');
var HomeComponent = (function () {
    function HomeComponent(_service) {
        this._service = _service;
    }
    HomeComponent.prototype.ngOnInit = function () {
        this._service.checkCredentials();
        if (localStorage.getItem("user")) {
            this.roles = JSON.parse(localStorage.getItem("user")).roles;
            this.selectedRole = JSON.parse(localStorage.getItem("user")).roles[0];
        }
        $(".dropdown-button").dropdown();
        $(".dropdown-button-mobile").dropdown();
        $(".button-collapse").sideNav();
    };
    HomeComponent.prototype.logout = function () {
        this._service.logout();
    };
    HomeComponent.prototype.changeSelectedRole = function (role) {
        var index = this.roles.indexOf(role);
        this.selectedRole = this.roles[index];
    };
    HomeComponent = __decorate([
        core_1.Component({
            selector: 'home',
            providers: [authentication_service_1.AuthenticationService],
            template: "\n            <ul id=\"dropdownUser\" class=\"dropdown-content\">\n              <li><a href=\"#!\">Profile</a></li>\n              <li class=\"divider\"></li>\n              <li *ngFor=\"let role of roles\">\n                <a (click)=\"changeSelectedRole(role)\" href=\"#!\">{{role}}</a>\n              </li>\n            </ul>\n            <ul id=\"dropdownMobile\" class=\"dropdown-content\">\n              <li><a href=\"#!\">Profile</a></li>\n              <li class=\"divider\"></li>\n              <li *ngFor=\"let role of roles\">\n                <a (click)=\"changeSelectedRole(role)\" href=\"#!\">{{role}}</a>\n              </li>\n            </ul>\n            <nav>\n              <div class=\"nav-wrapper\">\n                <a href=\"#\" class=\"brand-logo\">T247</a>\n                <a href=\"#\" data-activates=\"mobile-demo\" class=\"button-collapse\"><i class=\"material-icons\">menu</i></a>\n                <ul class=\"right hide-on-med-and-down\">\n                  <li><a href=\"sass.html\">Sass</a></li>\n                  <li><a href=\"badges.html\">Components</a></li>\n                  <li><a href=\"collapsible.html\">JavaScript</a></li>\n                  <!-- Dropdown Trigger -->\n                  <li><a class=\"dropdown-button\" href=\"#!\" data-activates=\"dropdownUser\">{{selectedRole}}<i class=\"material-icons right\">arrow_drop_down</i></a></li>\n                  <li><a (click)=\"logout()\" href=\"#\">Logout</a></li>\n                </ul>\n                <ul class=\"side-nav\" id=\"mobile-demo\">\n                  <li><a href=\"sass.html\">Sass</a></li>\n                  <li><a href=\"badges.html\">Components</a></li>\n                  <li><a href=\"collapsible.html\">JavaScript</a></li>\n                  <!-- Dropdown Trigger -->\n                  <li><a class=\"dropdown-button-mobile\" href=\"#!\" data-activates=\"dropdownMobile\">{{selectedRole}}<i class=\"material-icons right\">arrow_drop_down</i></a></li>\n                  <li><a (click)=\"logout()\" href=\"#\">Logout</a></li>\n                </ul>\n              </div>\n            </nav>\n            <div class=\"container\" >\n              <div class=\"content\" [ngSwitch]=\"selectedRole\">\n                <my-assignments *ngSwitchCase=\"'user'\"></my-assignments>\n                <list-of-problems *ngSwitchCase=\"'admin'\"></list-of-problems>\n                <my-courses *ngSwitchCase=\"'prof'\"></my-courses>\n              </div>\n            </div>\n    \t"
        }), 
        __metadata('design:paramtypes', [authentication_service_1.AuthenticationService])
    ], HomeComponent);
    return HomeComponent;
}());
exports.HomeComponent = HomeComponent;
//# sourceMappingURL=home.component.js.map