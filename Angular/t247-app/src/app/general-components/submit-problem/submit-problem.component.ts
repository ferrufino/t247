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
    /*Main Variables Declaration*/
    private progLangToSubmit;
    private descriptionEnglish;
    private descriptionSpanish;
    private descriptionTitle;
    private attempts;
    private input;
    private output;
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

    ngOnInit() {
        this.getContentDescription();
        this.getContentAttempt();
        this.progLangToSubmit = "none";
        document.getElementById('success-feedback').style.display = "none";
        document.getElementById('error-feedback').style.display = "none";

    }

    onChange($event) {
        if ($event == 1) {
            this.progLangToSubmit = "cpp";
        } else if($event == 2) {
            this.progLangToSubmit = "java";
        } else{
            this.progLangToSubmit = "none";
        }
        console.log(this.progLangToSubmit);
    }

    fade(element) {
        var op = 1;  // initial opacity
        var timer = setInterval(function () {
            if (op <= 0.1){
                clearInterval(timer);
                element.style.display = 'none';
            }
            element.style.opacity = (op).toString();
            console.log(op);
            element.style.filter = 'alpha(opacity=' + op * 100 + ")";
            op -= op * 0.1; // control how it disappears
        }, 50); // time showed
    }

    hideFeedbackCard(type:string) {

        if (type == "success") {
            var element = document.getElementById('success-feedback');
        } else {
            var element = document.getElementById('error-feedback');
        }
        window.setTimeout(() =>{
            this.fade(element);
            console.log("despues de fade");
        }, 5000);
        element.style.opacity = "1";
        element.style.filter = 'alpha(opacity=1)';

    }


    codeToSubmitReceived($event) {

        if(this.progLangToSubmit == "none"){
            document.getElementById('error-feedback').style.display = "block";
            this.hideFeedbackCard("error");

        }else{
            var codeFromEditor = $event;
            let codeObject = {
                "code": codeFromEditor,
                "language": this.progLangToSubmit,
                "problem_id": 13,
                "request_type": "submission",
                "user_id": 5
            }
            console.log(codeObject);
            this._httpProblemsService.submitProblem(codeObject).subscribe(
                data => {
                    if (data["status"] == "ok") {
                        document.getElementById('success-feedback').style.display = "block";
                        this.hideFeedbackCard("success");
                    } else {
                        document.getElementById('error-feedback').style.display = "block";
                        this.hideFeedbackCard("error");

                    }
                }
            );

        }



    }

    getContentDescription() {

        this._httpSubmitProblemService.getDescriptions().subscribe(
            content => {
                this.descriptionEnglish = content.english;
                this.descriptionSpanish = content.spanish;
                this.descriptionTitle = content.title;
                this.input = content.input;
                this.output = content.output;
            }
        );
    }

    getContentAttempt() {
        this._httpSubmitProblemService.getAttempts().subscribe(
            content => {
               this.attempts = content;
            }
        );
    }
}
