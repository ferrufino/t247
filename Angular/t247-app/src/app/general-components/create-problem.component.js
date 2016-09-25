/**
 * Created by Alfredo Hinojosa on 9/22/2016.
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
var supported_languages_service_1 = require("../services/supported-languages.service");
var problem_difficulties_service_1 = require("../services/problem-difficulties.service");
var CreateProblem = (function () {
    function CreateProblem(_supportedLanguages, _problemDifficulties) {
        this._supportedLanguages = _supportedLanguages;
        this._problemDifficulties = _problemDifficulties;
    }
    CreateProblem.prototype.ngOnInit = function () {
        this.supportedLanguages = this._supportedLanguages.getLanguages();
        this.difficulties = this._problemDifficulties.getDifficulties();
    };
    CreateProblem = __decorate([
        core_1.Component({
            selector: 'create-problem',
            providers: [supported_languages_service_1.SupportedLanguages, problem_difficulties_service_1.ProblemDifficulties],
            templateUrl: 'app/general-components/create-problem.component.html'
        }), 
        __metadata('design:paramtypes', [supported_languages_service_1.SupportedLanguages, problem_difficulties_service_1.ProblemDifficulties])
    ], CreateProblem);
    return CreateProblem;
}());
exports.CreateProblem = CreateProblem;
//# sourceMappingURL=create-problem.component.js.map