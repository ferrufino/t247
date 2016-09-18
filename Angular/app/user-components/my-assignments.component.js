/**
 * Created by ahinojosa on 14/09/16.
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
var router_1 = require("@angular/router");
var MyAssignments = (function () {
    function MyAssignments(_router) {
        this._router = _router;
        this.title = 'Test';
    }
    MyAssignments = __decorate([
        core_1.Component({
            selector: 'my-assignments',
            templateUrl: 'app/user-components/templates/my-assignments.component.html'
        }), 
        __metadata('design:paramtypes', [router_1.Router])
    ], MyAssignments);
    return MyAssignments;
}());
exports.MyAssignments = MyAssignments;
//# sourceMappingURL=my-assignments.component.js.map