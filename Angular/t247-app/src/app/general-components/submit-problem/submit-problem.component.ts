import {Component, OnInit, ViewChild} from '@angular/core';
import {
    IMultiSelectOption,
    IMultiSelectTexts,
    IMultiSelectSettings
} from 'angular-2-dropdown-multiselect/src/multiselect-dropdown';
import {EvaluatorService} from "../../services/evaluator.service";
import {SubmitProblemService} from "../../services/submit-problem.service";
import { ActivatedRoute, Params }   from '@angular/router';


@Component({
    selector: 'submit-problem',
    templateUrl: './submit-problem.component.html',
    styleUrls: ['./submit-problem.component.css'],
    providers: [EvaluatorService, SubmitProblemService]
})
export class SubmitProblem implements OnInit {

    constructor(private _httpProblemsService:EvaluatorService, private _httpSubmitProblemService:SubmitProblemService, private route: ActivatedRoute) {

    }
    /*Main Variables Declaration*/
    private progLangToSubmit;
    private descriptionEnglish;
    private descriptionSpanish;
    private descriptionTitle;
    private attempts;
    private testCases;
    private successMessage:string = "Success";
    private errorMessage:string = "Error";
    private myOptions:IMultiSelectOption[] = [
        {id: 1, name: 'C++'},
        {id: 2, name: 'Java'},
    ];
    @ViewChild('codeEditor') codeEditor;
    @ViewChild('feedbackCard') feedbackCard;

    private mySettings:IMultiSelectSettings = {

        selectionLimit: 1,
        closeOnSelect: true,
        checkedStyle: 'checkboxes'
    }
    private myTexts:IMultiSelectTexts = {
        checked: 'checked',
        defaultTitle: 'Programming Languages'
    };
    private problemId;
    ngOnInit() {

        this.route.params.forEach((params: Params) => {
            this.problemId = +params['id'];
            this.getContentDescription(this.problemId);
            let userInfo = JSON.parse(sessionStorage.getItem("userJson"));
            console.log(userInfo.id + " " + this.problemId);
            this.getContentAttempt(userInfo.id, this.problemId);
        });

        this.progLangToSubmit = "none";


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
    
    
    codeToSubmitReceived() {
        if(this.progLangToSubmit == "none"){
            document.getElementById('error-feedback').style.display = "block";
            this.feedbackCard.hideFeedbackCard("error", this.errorMessage);

        }else{
            var codeFromEditor = this.codeEditor.getSourceCode();
            let userInfo = JSON.parse(sessionStorage.getItem("userJson"));

            let codeObject = {
                "code": codeFromEditor,
                "language": this.progLangToSubmit,
                "problem_id": this.problemId,
                "request_type": "submission",
                "user_id": userInfo.id
            }
            console.log(codeObject);
            this._httpProblemsService.submitProblem(codeObject).subscribe(
                data => {
                    if (data["status"] == "ok") {
                        
                        this.feedbackCard.hideFeedbackCard("success", this.successMessage);
                    } else {
                        this.feedbackCard.hideFeedbackCard("error", this.errorMessage);

                    }
                }
            );

        }



    }

    getContentDescription(id) {

        this._httpSubmitProblemService.getDescriptions(id).subscribe(
            content => {
                this.descriptionEnglish = content.english;
                this.descriptionSpanish = content.spanish;
                this.descriptionTitle = content.title;
                this.testCases = content.test_cases;
            }
        );
    }

    getContentAttempt(s_id, id) {
        this._httpSubmitProblemService.getAttempts(s_id, id).subscribe(
            content => {
               this.attempts = content;
            }
        );
    }
}
