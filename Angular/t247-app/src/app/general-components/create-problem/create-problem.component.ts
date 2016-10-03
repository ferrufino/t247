/**
 * Created by Alfredo Hinojosa on 9/22/2016.
 */

import { Component } from '@angular/core';
import {SupportedLanguages, ProgLanguage} from "../../services/supported-languages.service";
import {ProblemDifficulties} from "../../services/problem-difficulties.service";

@Component({
    selector: 'create-problem',
    providers: [SupportedLanguages, ProblemDifficulties],
    templateUrl: './create-problem.component.html'
})

export class CreateProblem {

    // This variable specifies the form type that will be displayed, in order to upload the problem
    // 0 = default value, 1 = full problem, 2 = function
    problemTypeFlag : number = 0;

    constructor(
        private _supportedLanguages:SupportedLanguages,
        private _problemDifficulties:ProblemDifficulties){}

    supportedLanguages : ProgLanguage[];
    difficulties : string[]

    ngOnInit(){
        this.supportedLanguages = this._supportedLanguages.getLanguages();
        this.difficulties = this._problemDifficulties.getDifficulties();
    }


    checkTestCases(){
      console.log("Sending data to evaluator..");
    }

}
