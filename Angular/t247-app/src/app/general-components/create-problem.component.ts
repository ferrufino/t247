/**
 * Created by Alfredo Hinojosa on 9/22/2016.
 */

import { Component } from '@angular/core';
import {SupportedLanguages, ProgLanguage} from "../services/supported-languages.service";
import {ProblemDifficulties} from "../services/problem-difficulties.service";

@Component({
    selector: 'create-problem',
    providers: [SupportedLanguages, ProblemDifficulties],
    templateUrl: './create-problem.component.html'
})

export class CreateProblem {

    constructor(
        private _supportedLanguages:SupportedLanguages,
        private _problemDifficulties:ProblemDifficulties){}

    supportedLanguages : ProgLanguage[];
    difficulties : string[]

    ngOnInit(){
        this.supportedLanguages = this._supportedLanguages.getLanguages();
        this.difficulties = this._problemDifficulties.getDifficulties();
    }

}
