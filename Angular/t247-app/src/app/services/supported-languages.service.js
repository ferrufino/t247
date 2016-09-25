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
var ProgLanguage = (function () {
    function ProgLanguage(name, version) {
        this.name = name;
        this.version = version;
    }
    return ProgLanguage;
}());
exports.ProgLanguage = ProgLanguage;
var languges = [
    new ProgLanguage('C++', 'C++14'),
    new ProgLanguage('Java', 'Java 8')
];
var SupportedLanguages = (function () {
    function SupportedLanguages() {
    }
    SupportedLanguages.prototype.getLanguages = function () {
        return languges;
    };
    SupportedLanguages = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], SupportedLanguages);
    return SupportedLanguages;
}());
exports.SupportedLanguages = SupportedLanguages;
//# sourceMappingURL=supported-languages.service.js.map