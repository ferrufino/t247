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
var router_1 = require('@angular/router');
require('rxjs/add/operator/toPromise');
require('rxjs/add/operator/map');
var http_1 = require('@angular/http');
var InMemoryDataService = (function () {
    function InMemoryDataService() {
    }
    InMemoryDataService.prototype.createDb = function () {
        var heroes = [
            { id: 11, name: 'Mr. Nice' },
            { id: 12, name: 'Narco' },
            { id: 13, name: 'Bombasto' },
            { id: 14, name: 'Celeritas' },
            { id: 15, name: 'Magneta' },
            { id: 16, name: 'RubberMan' },
            { id: 17, name: 'Dynama' },
            { id: 18, name: 'Dr IQ' },
            { id: 19, name: 'Magma' },
            { id: 20, name: 'Tornado' }
        ];
        return { heroes: heroes };
    };
    return InMemoryDataService;
}());
exports.InMemoryDataService = InMemoryDataService;
var User = (function () {
    function User(email, password, roles, token) {
        this.email = email;
        this.password = password;
        this.roles = roles;
        this.token = token;
    }
    return User;
}());
exports.User = User;
var users = [
    new User('admin@admin.com', 'admin', ['admin', 'prof', 'user']),
    new User('root@gmail.com', 'root', ['user'])
];
var AuthenticationService = (function () {
    function AuthenticationService(_router, http) {
        this._router = _router;
        this.http = http;
        this.loggedIn = false;
        this.loginUrl = 'http://localhost:5000/api/login';
        this.headers = new http_1.Headers({ 'Content-Type': 'application/json' });
        this.loggedIn = !!sessionStorage.getItem('auth_token');
    }
    AuthenticationService.prototype.logout = function () {
        sessionStorage.removeItem("email_user");
        this.loggedIn = false;
        this._router.navigate(['login']);
    };
    AuthenticationService.prototype.login = function (user) {
        var _this = this;
        return this.http
            .post(this.loginUrl, JSON.stringify({ email: user.email, password: user.password }), this.headers)
            .map(function (res) { return res.json(); })
            .map(function (res) {
            if (res.success) {
                sessionStorage.setItem('auth_token', res.auth_token);
                sessionStorage.setItem('email_user', user.email);
                _this.loggedIn = true;
            }
            return res.success;
        });
    };
    AuthenticationService.prototype.checkCredentials = function () {
        if (!this.loggedIn) {
            this._router.navigate(['login']);
        }
    };
    AuthenticationService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [router_1.Router, http_1.Http])
    ], AuthenticationService);
    return AuthenticationService;
}());
exports.AuthenticationService = AuthenticationService;
//# sourceMappingURL=authentication.service.js.map