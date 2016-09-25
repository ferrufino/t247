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
/**
 * Created by ahinojosa on 13/09/16.
 */
var core_1 = require('@angular/core');
var authentication_service_1 = require('../services/authentication.service');
var LoginComponent = (function () {
    function LoginComponent(_service) {
        this._service = _service;
        this.user = new authentication_service_1.User('', '', ['']);
        this.errorMsg = '';
    }
    LoginComponent.prototype.login = function () {
        if (!this._service.login(this.user)) {
            this.errorMsg = 'Failed to login';
        }
    };
    LoginComponent = __decorate([
        core_1.Component({
            selector: 'login-form',
            providers: [authentication_service_1.AuthenticationService],
            template: "\n        <link type=\"text/css\" rel=\"stylesheet\" href=\"styles/estilosHomePage.css\"/>\n        <nav style=\"height:80px\">\n           <div class=\"nav-wrapper #4a148c purple darken-4\">\n               <a href=\"\" class=\"brand-logo\" id='logo'>Logo</a>\n           </div>\n        </nav>\n        <div class=\"container\" id=\"main\">\n              <div class=\"row\">\n               <div class=\"col s6\">\n                   <img src=\"styles/mientras.jpg\" style=\"width:324px;height:258px; padding-top: 0px;\">\n               </div>\n               <div class=\"col s6\">\n                   <h2>Welcome</h2>\n                   <br><br>\n                       <div class=\"row\">\n                            <div class=\"input-field col s12\">\n                                <input [(ngModel)]=\"user.email\" id=\"email\" \n                                    type=\"email\" class=\"validate\">\n                                <label for=\"email\">Email</label>\n                            </div>\n                       </div>\n                       <div class=\"row\">\n                           <div class=\"input-field col s12\">\n                                <input [(ngModel)]=\"user.password\" id=\"password\"\n                                    type=\"password\" class=\"validate\">\n                                <label for=\"password\">Password</label>\n                           </div>\n                       </div>\n                       <a href=\"\"><h6>Forgot your password?</h6></a>  \n                       <br><br>\n                       <span>{{errorMsg}}</span>\n                       <button (click)=\"login()\" class=\"btn waves-effect waves-light btn #4a148c purple darken-4 right\"\n                            type=\"submit\" name=\"action\">Login</button>\n               </div>\n              </div>\n        </div>\n        <footer class=\"page-footer N/A transparent\">\n          <div class=\"footer-copyright N/A transparent\">\n            <div class=\"container\" id=\"footer\">\n                <img src=\"styles/tec.png\" class=\"right\">\n            </div>\n          </div>\n        </footer>\n    \t"
        }), 
        __metadata('design:paramtypes', [authentication_service_1.AuthenticationService])
    ], LoginComponent);
    return LoginComponent;
}());
exports.LoginComponent = LoginComponent;
//# sourceMappingURL=login.component.js.map