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
var MyAssignments = (function () {
    function MyAssignments() {
    }
    MyAssignments = __decorate([
        core_1.Component({
            selector: 'my-assignments',
            template: "\n  <table class=\"bordered centered\">\n      <thead>\n        <tr>\n            <th data-field=\"id\">#</th>\n            <th data-field=\"name\">Name</th>\n            <th data-field=\"course\">Course</th>\n            <th data-field=\"topic\">Topic</th>\n            <th data-field=\"completed\">Completed</th>\n        </tr>\n      </thead>\n\n      <tbody>\n        <tr>\n          <td>1</td>\n          <td>\n            <a href=\"#\">Something</a>\n          </td>\n          <td>Data Structures</td>\n          <td>Linked Lists</td>\n          <td>\n            <input type=\"checkbox\" id=\"check1\" />\n            <label for=\"check1\"></label>\n          </td>\n        </tr>\n        <tr>\n          <td>2</td>\n          <td>\n            <a href=\"#\">Something</a>\n          </td>\n          <td>Data Structures</td>\n          <td>Linked Lists</td>\n          <td>\n            <input type=\"checkbox\" id=\"check2\" />\n            <label for=\"check2\"></label>\n          </td>\n        </tr>\n        <tr>\n          <td>3</td>\n          <td>\n            <a href=\"#\">Something</a>\n          </td>\n          <td>Data Structures</td>\n          <td>Linked Lists</td>\n          <td>\n            <input type=\"checkbox\" id=\"check3\" />\n            <label for=\"check3\"></label>\n          </td>\n        </tr>\n      </tbody>\n    </table>\n                      "
        }), 
        __metadata('design:paramtypes', [])
    ], MyAssignments);
    return MyAssignments;
}());
exports.MyAssignments = MyAssignments;
//# sourceMappingURL=my-assignments.component.js.map