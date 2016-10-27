import {Component, OnInit} from '@angular/core';
import {
    IMultiSelectOption,
    IMultiSelectTexts,
    IMultiSelectSettings
} from 'angular-2-dropdown-multiselect/src/multiselect-dropdown';
import {EvaluatorService} from "../../services/evaluator.service";
import {SubmitProblemService} from "../../services/submit-problem.service";

@Component({
    selector: 'submit-problem',
    templateUrl: './submit-problem.component.html',
    styleUrls: ['./submit-problem.component.css'],
    providers: [EvaluatorService, SubmitProblemService]
})
export class SubmitProblem implements OnInit {
    constructor(private _httpProblemsService:EvaluatorService, private _httpSubmitProblemService:SubmitProblemService) {

    }
    ngOnInit() {
        this.getContentDescription();


    }
    private progLangToSubmit;
    private descriptionEnglish;
    private descriptionSpanish;
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

    codeToSubmit($event) {
        console.log($event);

        var codeFromEditor = $event;
        let codeObject = {
            "code": codeFromEditor,
            "language": this.progLangToSubmit,
            "problem_id": 5,
            "request_type": "submission",
            "user_id": 2
        }

        this._httpProblemsService.submitProblem(codeObject).subscribe(
            data => {
                console.log(data);
            }
        );



    }

    getContentDescription(){

        this._httpSubmitProblemService.getDescriptions().subscribe(
            content => {
                this.descriptionEnglish = content.english;
                this.descriptionSpanish = content.spanish;
            }
        );
    }


}
