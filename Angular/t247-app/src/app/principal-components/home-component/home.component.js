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
var authentication_service_1 = require('../../services/authentication.service');
var HomeComponent = (function () {
    function HomeComponent(_service) {
        this._service = _service;
    }
    HomeComponent.prototype.ngOnInit = function () {
        this._service.checkCredentials();
        if (sessionStorage.getItem("email_user")) {
            this.roles = JSON.parse(sessionStorage.getItem("roles"));
            this.selectedRole = this.roles[0];
        }
        //  $(".dropdown-button").dropdown();
        //  $(".dropdown-button-mobile").dropdown();
        //  $(".button-collapse").sideNav();
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
            templateUrl: './home.component.html',
            styleUrls: ['../../../styles/general-styles.css']
        }), 
        __metadata('design:paramtypes', [authentication_service_1.AuthenticationService])
    ], HomeComponent);
    return HomeComponent;
}());
exports.HomeComponent = HomeComponent;
//# sourceMappingURL=home.component.js.map