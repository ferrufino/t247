import {Component, OnInit} from '@angular/core';
import {
    IMultiSelectOption,
    IMultiSelectTexts,
    IMultiSelectSettings
} from 'angular-2-dropdown-multiselect/src/multiselect-dropdown';
import {EvaluatorService} from "../../services/evaluator.service";

@Component({
    selector: 'submit-problem',
    templateUrl: './submit-problem.component.html',
    styleUrls: ['./submit-problem.component.css'],
    providers: [EvaluatorService]
})
export class SubmitProblem {
    constructor(private _httpProblemsService:EvaluatorService) {

    }

    progLangToSubmit;
    private selectedOptions:number[];
    private myOptions:IMultiSelectOption[] = [
        {id: 1, name: 'C++'},
        {id: 2, name: 'Java'},
    ];

    private mySettings:IMultiSelectSettings = {

        selectionLimit: 1,
        closeOnSelect: true,
        checkedStyle: 'checkboxes'
    }
    private myTexts:IMultiSelectTexts = {
        checked: 'checked',
        defaultTitle: 'Programming Languages'
    };

    onChange($event) {
        if ($event == 1) {
            this.progLangToSubmit = "cpp";
        } else {
            this.progLangToSubmit = "java";
        }
    }

    submitCode($event) {
        console.log($event);

        var codeFromEditor = $event;
        let codeObject = {
            "code": $event,
            "language": this.progLangToSubmit,
            "problem_id": 5,
            "request_type": "submission",
            "user_id": 2
        }

        this._httpProblemsService.submitProblem(codeFromEditor).subscribe(
            data => {
                console.log(data);
            },
            err => {
                console.log(err);
            }
        );
    }


}
