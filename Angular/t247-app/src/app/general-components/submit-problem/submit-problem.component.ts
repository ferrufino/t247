import {Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import {
    IMultiSelectOption,
    IMultiSelectTexts,
    IMultiSelectSettings
} from 'angular-2-dropdown-multiselect/src/multiselect-dropdown';
import {EvaluatorService} from "../../services/evaluator.service";
import {SubmitProblemService} from "../../services/submit-problem.service";
import {ActivatedRoute, Params}   from '@angular/router';
import {SupportedLanguages, ProgLanguage} from "../../services/supported-languages.service";
import {Tabs} from "../tabs/tabs.component";
import { HighlightJsService } from 'angular2-highlight-js';


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
                private _supportedLanguages:SupportedLanguages,
                private highlightService : HighlightJsService,
                private el: ElementRef) {

    }

    /*Main Variables Declaration*/
    private progLangToSubmit;
    private descriptionEnglish;
    private descriptionSpanish;
    private descriptionTitle;
    private languageName;
    private languageCode;

    private testCases;
    private successMessage:string = "Your code has been submitted!";
    private errorMessage:string = "There has been a problem with your submission";
    private template:string;
    private myOptions:IMultiSelectOption[] = [
        {id: 1, name: 'C++'},
        {id: 2, name: 'Java'},
    ];

    private codeAttempts:Array<any> = [1, 2, 3];
    private posTabActive:number = 0;
    private signaturePresent:string = "";
    @ViewChild('tabsVariable') tabsVariable;
    @ViewChild('codeEditor') codeEditor;
    @ViewChild('feedbackCard') feedbackCard;
    codeFromAttempt:string;


    supportedLanguages:ProgLanguage[]; // filled from service
    problemProgLang:string; // The selected language of the problem
    attempts;


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
            let userInfo = JSON.parse(localStorage.getItem("userJson"));
            this.getContentAttempt(userInfo.id, this.problemId);
        });

        this.progLangToSubmit = "none";

        this._supportedLanguages.getLanguages().subscribe(
            response => {
                this.supportedLanguages = response;
                this.problemProgLang = "cpp";

            },
            error => {
                console.log("Error loading the supported languages!");
            }
        );
        this.codeFromAttempt = this.codeAttempts[0];
        document.getElementById('btn-modal').style.visibility = 'hidden';

    }

    codeToSubmitReceived() {

        var progLanguage;
        if(this.signaturePresent != ''){

            progLanguage = this.languageCode;

        }else{

            progLanguage = (<HTMLInputElement>document.getElementById("selectorLanguages")).value;
        }
        var codeFromEditor = this.codeEditor.getSourceCode();

        // Prevent students from sending empty code
        if (codeFromEditor.trim() == "") {
            return;
        }

        let userInfo = JSON.parse(localStorage.getItem("userJson"));

        let codeObject = {
            "code": codeFromEditor,
            "language": progLanguage,
            "problem_id": this.problemId,
            "request_type": "submission",
            "user_id": userInfo.id
        };
        console.log("Codigo a mandar: " + codeObject);

        this._httpProblemsService.submitProblem(codeObject).subscribe(
            data => {
                if (data["status"] == "ok") {
                    // Set all attempt tabs as inactive
                    for (var i = 0; i < data["attempts"].length; i++) {
                        data["attempts"][i].active = null;
                    }

                    // Activate last attempt tab
                    data["attempts"][0].active = true;

                    // Update attempts
                    this.attempts = data["attempts"].slice();

                    // Set attempts' code
                    for (var i = 0; i < this.attempts.length; i++) {
                        this.codeAttempts[i] = this.attempts[i].code;
                    }

                    // Select second tab (which is last attempt's tab)
                    this.tabsVariable.tabSelected = 1;

                    // Inactivate 'New attempt tab' and hide it
                    this.tabsVariable.tabs.toArray()[0].active = false;
                    document.getElementById('btn-modal').style.visibility = 'visible';

                    // Display success message
                    // TODO: display proper success notification
                    //this.feedbackCard.hideFeedbackCard("success", this.successMessage);
                } else {
                    // TODO: display proper error notification
                    //this.feedbackCard.hideFeedbackCard("error", this.errorMessage);

                }
            }
        );


    }

    loadCode() {
        // Manually inserting code in modal so that it is properly displayed (http://stackoverflow.com/questions/40693556/using-highlight-js-in-angular-2)
        var codeElement = this.el.nativeElement.querySelector('.code-attempt');

        // Insert dummy appropriate content so that real content will be appropriately displayed/highlighted
        // (even if real content is malformed)
        codeElement.textContent = "int function(string a, string b) { return a[8]; }";

        // Insert real content
        this.codeFromAttempt = this.codeAttempts[this.tabsVariable.tabSelected - 1];
        codeElement.textContent = this.codeAttempts[this.tabsVariable.tabSelected - 1];
        this.highlightService.highlight(codeElement);
    }

    getContentDescription(id) {

        this._httpSubmitProblemService.getDescriptions(id).subscribe(
            content => {
                this.descriptionEnglish = content.english;
                this.descriptionSpanish = content.spanish;
                this.descriptionTitle = content.title;
                this.testCases = content.test_cases;
                if (content.signature) {
                    this.codeEditor.setNewSourceCode(content.signature);
                    this.signaturePresent = content.language;
                    this.languageCode = content.language_code;
                    this.languageName = content.language_name;
                }

            }
        );
    }

    getContentAttempt(s_id, id) {

        this._httpSubmitProblemService.getAttempts(s_id, id).subscribe(
            content => {

                this.attempts = content;
                console.log("CODE ATTEMPTS:");
                console.log(this.attempts);

                for (var i = 0; i < content.length; i++) {

                    this.codeAttempts[i] = content[i].code;
                }

                console.log(this.codeAttempts);
            }
        );
    }

    assignActiveTab(pos:number) {
        this.posTabActive = pos;
    }

    onNotify(index:number):void {
        if (index == 0) {
            document.getElementById('btn-modal').style.visibility = 'hidden';
        } else {
            document.getElementById('btn-modal').style.visibility = 'visible';
        }
    }
}
