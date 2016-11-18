import {Component, OnInit, ViewChild} from '@angular/core';
import {
    IMultiSelectOption,
    IMultiSelectTexts,
    IMultiSelectSettings
} from 'angular-2-dropdown-multiselect/src/multiselect-dropdown';
import {EvaluatorService} from "../../services/evaluator.service";
import {SubmitProblemService} from "../../services/submit-problem.service";
import {ActivatedRoute, Params}   from '@angular/router';
import {SupportedLanguages, ProgLanguage} from "../../services/supported-languages.service";


@Component({
    selector: 'submit-problem',
    templateUrl: './submit-problem.component.html',
    styleUrls: ['./submit-problem.component.css'],
    providers: [SupportedLanguages, EvaluatorService, SubmitProblemService]
})
export class SubmitProblem implements OnInit {

    constructor(private _httpProblemsService:EvaluatorService,
                private _httpSubmitProblemService:SubmitProblemService,
                private route:ActivatedRoute,
                private _supportedLanguages: SupportedLanguages) {

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
    private template:string;
    private myOptions:IMultiSelectOption[] = [
        {id: 1, name: 'C++'},
        {id: 2, name: 'Java'},
    ];
    @ViewChild('codeEditor') codeEditor;
    @ViewChild('codeAttempt') codeAttempt;
    @ViewChild('feedbackCard') feedbackCard;

    
    supportedLanguages: ProgLanguage[]; // filled from service
    problemProgLang: string; // The selected language of the problem



    private mySettings:IMultiSelectSettings = {

        selectionLimit: 1,
        closeOnSelect: true,
        checkedStyle: 'checkboxes'
    };

    private myTexts:IMultiSelectTexts = {
        checked: 'checked',
        defaultTitle: 'Programming Languages'
    };
    private problemId;

    ngOnInit() {

        this.route.params.forEach((params:Params) => {
            this.problemId = +params['id'];
            this.getContentDescription(this.problemId);
            let userInfo = JSON.parse(sessionStorage.getItem("userJson"));
            console.log(userInfo.id + " " + this.problemId);
            this.getContentAttempt(userInfo.id, this.problemId);
        });

        this.progLangToSubmit = "none";

        this._supportedLanguages.getLanguages().subscribe(
            respose => {
                this.supportedLanguages = respose;
                this.problemProgLang = this.supportedLanguages[0].value;

            },
            error => {
                console.log("Error loading the supported languages!");
            }
        );
    }

    

    codeToSubmitReceived(progLang) {
        var codeFromEditor = this.codeEditor.getSourceCode();
            let userInfo = JSON.parse(sessionStorage.getItem("userJson"));
            let codeObject = {
                "code": codeFromEditor,
                "language": progLang,
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

    loadCode(code){
        this.codeAttempt.setNewSourceCode(code);
    }

    getContentDescription(id) {

        this._httpSubmitProblemService.getDescriptions(id).subscribe(
            content => {
                this.descriptionEnglish = content.english;
                this.descriptionSpanish = content.spanish;
                this.descriptionTitle = content.title;
                this.testCases = content.test_cases;
                if(content.signature){
                    this.codeEditor.setNewSourceCode(content.signature);
                }
                console.log(content.signature);

            }
        );
    }

    getContentAttempt(s_id, id) {
        this._httpSubmitProblemService.getAttempts(s_id, id).subscribe(
            content => {
                this.attempts = content;
                console.log(this.attempts);
            }
        );
    }
}
