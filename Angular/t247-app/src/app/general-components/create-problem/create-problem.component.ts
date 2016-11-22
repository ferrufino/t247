import {Component, OnInit, ViewChild, ContentChild, AfterContentInit, AfterContentChecked} from '@angular/core';
import {
  FormGroup,
  Validators,
  FormBuilder,
} from "@angular/forms";

import {SupportedLanguages, ProgLanguage} from "../../services/supported-languages.service";
import {ProblemDifficulties} from "../../services/problem-difficulties.service";
import {EvaluatorService} from "../../services/evaluator.service";
import {TestCase} from "./TestCase";
import {TopicsService} from "../../services/topics.service";
import {EditorComponent} from "../code-editor/editor.component";
import {Router} from '@angular/router';
import {isNullOrUndefined} from "util";

@Component({
  selector: 'create-problem',
  providers: [SupportedLanguages, ProblemDifficulties, EvaluatorService],
  templateUrl: './create-problem.component.html',
  styleUrls: ['./create-problem.component.css']
})

export class CreateProblem implements OnInit, AfterContentChecked {

  // Local variables to the 4 code editors
  @ViewChild('fullCodeEditor') fullEditorComponent;
  @ViewChild('functionCodeEditor') functionEditorComponent;
  @ViewChild('templateCodeEditor') templateEditorComponent;
  @ViewChild('signatureCodeEditor') signatureEditorComponent;

  // Feedback part
  @ViewChild('feedbackCard') feedbackCard;

  createProblemForm: FormGroup; // Form group to get the info of the problem
  displayLoader: boolean; // Flag used to display the loader when the form is submitted

  supportedLanguages: ProgLanguage[]; // filled from service
  problemTopics: any; // A list of all the topics available for a problem
  problemProgLang: string; // The selected language of the problem

  difficulties: string[]; // filled from service
  problemDifficulty: string; // The selected difficulty of the problem
  problemTopicID: number; // The id of the topic for this problem


  problemSourceCode: string; // The source code of the problem, used for complete and template type
  problemFunctionCode: string; // This is the correct method
  problemTemplateCode: string; // This is the skeleton of the whole program, it contains the control character
  problemSignatureCode: string; // This is the method's skeleton that will be given to the student

  problemTestCases: TestCase[]; // The array of test cases realted to the problem
  testCasesReady: boolean; // Flag that when is true means that all test cases passed the check
  testCaseIndex: number; // Number that is equal to the index of the displayed test case
  selectedTestCase: TestCase; // Current Test Case being displayed


  // This variable specifies the form type that will be displayed, in order to upload the problem
  // 0 = full problem, 1 = function
  problemTypeFlag: number = 0;

  // This variable specifies if the problem will be uploaded as copy paste text or if it will be uploaded as a file
  // 0 = copy and paste, 1 = upload file
  uploadType: number = 0;

  // Values stored for goBackFunction
  problemDifficultyIndex: number;
  pendingCodeRestore: boolean;

  constructor(private _httpProblemsService: EvaluatorService,
              private _supportedLanguages: SupportedLanguages,
              private _problemDifficulties: ProblemDifficulties,
              private _topicsService: TopicsService,
              private _formBuilder: FormBuilder,
              private _router: Router) {
  }


  /**
   * This function runs when the component starts, here the problem form is created.
   * Here the problem difficulties and the supported languages are obtained from their services
   */
  ngOnInit() {

    this.problemTestCases = []; // the array of testcases that will be tested
    this.testCaseIndex = 0;
    this.testCasesReady = false;
    this.selectedTestCase = null;
    this.displayLoader = false;
    this.problemSourceCode = "";
    this.problemFunctionCode = "";
    this.problemTemplateCode = "";
    this.problemSignatureCode = "";
    this.problemDifficultyIndex = 0;
    this.pendingCodeRestore = false;


    // Get the values from services
    this.difficulties = this._problemDifficulties.getDifficulties(); // Call the fake service

    this._supportedLanguages.getLanguages().subscribe(
      respose => {
        this.supportedLanguages = respose;
        this.problemProgLang = this.supportedLanguages[0].value;
      },
      error => {
        console.log("Error loading the supported languages!");
      }
    );

    this._topicsService.getTopics().subscribe(
      response => {
        this.problemTopics = response;
      },
      error => {
        console.log("Error loading the topics!");
      }
    );

    // Set the default values
    this.problemDifficulty = this.difficulties[0];

    // Create the problem form object
    this.createProblemForm = this._formBuilder.group({

      'problemDetails': this._formBuilder.group({
        'problemName': ['', Validators.required],
        'engDescription': ['', Validators.required],
        'spnDescription': ['', Validators.required],
        'memoryLimit': ['', Validators.required],
        'timeLimit': ['', Validators.required]
      })

    });

  }


  // Check on this cycle if the code should be restored
  ngAfterContentChecked() {

    if (this.pendingCodeRestore) {

      // if (this.problemTypeFlag == 0 && this.fullEditorComponent != undefined) {
      //
      //   // Reset the full component problem editor
      //   this.fullEditorComponent.setNewSourceCode(this.problemSourceCode);
      //
      // } else if (this.problemTypeFlag == 1 && this.functionEditorComponent != undefined &&
      //   this.templateEditorComponent != undefined &&
      //   this.signatureEditorComponent != undefined) {
      //
      //   // Reset the three editors
      //   this.functionEditorComponent.setNewSourceCode(this.problemFunctionCode);
      //   this.templateEditorComponent.setNewSourceCode(this.problemTemplateCode);
      //   this.signatureEditorComponent.setNewSourceCode(this.problemSignatureCode);
      //
      // }

      this.pendingCodeRestore = false;
    }
  }

  /**
   * This function obtains the input for all the test cases and returns them as a string array.
   * @returns {string[]} containing all the inputs for each test case
   */
  getInputFromTestCases(): string[] {

    let inputs: string[] = [];

    for (let i = 0; i < this.problemTestCases.length; i++) {
      inputs.push(this.problemTestCases[i].input); // The input property = inputs
    }

    return inputs;
  }

  /**
   * Function used in the Carousel
   * This function sets the correct test case as the selected one
   */
  updateSelectedTestCase(): any {
    this.selectedTestCase = this.problemTestCases[this.testCaseIndex];
  }

  /**
   * Function used in the Carousel
   * This function sets the correct test case to a previous one in the array of tests cases,
   * if the new index is less than zero then the selected test case will be the last one in the array
   */
  previousTestCase(): any {
    let actual = this.testCaseIndex - 1;
    this.testCaseIndex = (actual < 0) ? this.problemTestCases.length - 1 : actual;
    this.updateSelectedTestCase();
  }

  /**
   * Function used in the Carousel
   * This function sets the correct test case to the next one in the array of tests cases,
   * if the new index is bigger than the max length of the array then the selected test case
   * will be the first one in the array
   */
  nextTestCase(): any {
    let actual = this.testCaseIndex + 1;
    this.testCaseIndex = (actual > this.problemTestCases.length - 1) ? 0 : actual;
    this.updateSelectedTestCase();
  }

  /**
   * This function returns the complete source code of the problem into a string
   * This functions handles if the source code is of a full problem or a function problem.
   * @returns {string} the source code in a string
   */
  getSourceCodeString(): string {

    let sourceCode: string;
    let controlComment = "//&function";

    switch (this.problemTypeFlag) {
      case 0:
        sourceCode = this.fullEditorComponent.getSourceCode();
        break;
      case 1:
        // Change the control Comment for the real function
        this.problemFunctionCode = this.functionEditorComponent.getSourceCode();
        this.problemTemplateCode = this.templateEditorComponent.getSourceCode();
        this.problemSignatureCode = this.signatureEditorComponent.getSourceCode();

        sourceCode = this.problemTemplateCode.replace(controlComment, this.problemFunctionCode);
        break;
      default:
        sourceCode = "Error";
    }

    return sourceCode;
  }


  /**
   * This functions returns true if one test case feedback is empty
   * @returns {boolean}
   */
  emptyTestCasesFeedback() {

    for (let test of this.problemTestCases) {
      if (test["feedback"] === "" || test["feedback"] === undefined) {
        return true;
      }
    }

    return false;
  }


  /**
   * This functions returns true if one test case input is empty
   * @returns {boolean}
   */
  emptyTestCasesInput() {

    for (let test of this.problemTestCases) {
      if (test["input"] === "" || test["input"] === undefined) {
        return true;
      }
    }

    return false;
  }

  /**
   * This function reads the outputs from the evaluator response to complete the test cases.
   * @param data, the response from the evaluator
   * @returns {boolean} a flag that is true when all the test cases have as status successful run
   */
  setOutputForTestCases(data: any): boolean {

    let success = true;

    for (let i = 0; i < this.problemTestCases.length; i++) {

      let aux = data.test_cases[i];

      if (aux["status"] == "successful run") {
        this.problemTestCases[i].output = aux["output"]; // Set the output to the respective test case
      } else {
        success = false; // Error in test case, the form is not ready for next step
      }

      this.problemTestCases[i].status = aux["status"]; // Set the status to the respective test case
    }

    return success;
  }

  /**
   * GET OUTPUT OF TEST CASES
   * This function sends the code and the test cases to the evaluator in order to get the
   * correct output for each test case.
   *
   * This functions connects to the HTTP PROBLEMS SERVICE
   */
  evaluteTestCases(selectedLanguage: string, selectedDifficulty: string, selectedTopicId: number) {

    this.problemTopicID = selectedTopicId;

    // Assign the correct values
    this.displayLoader = true; // display the loader
    this.problemProgLang = selectedLanguage;
    this.problemDifficulty = selectedDifficulty;
    this.problemDifficultyIndex = Number(selectedDifficulty);


    let inputs: string[] = this.getInputFromTestCases(); // test cases input strings

    this.problemSourceCode = this.getSourceCodeString(); // Get the code, depending of the type of problem

    // The object that will be sent to the evaluator
    let request = {
      "request_type": "creation",
      "name": this.createProblemForm.value.problemDetails.problemName,
      "code": this.problemSourceCode,
      "language": this.problemProgLang,
      "time_limit": this.createProblemForm.value.problemDetails.timeLimit,
      "memory_limit": this.createProblemForm.value.problemDetails.memoryLimit,
      "test_cases": inputs
    };


    //Make the POST
    this._httpProblemsService.checkProblemTestCases(request)
      .subscribe(
        data => {

          this.displayLoader = false; // Turn off loader

          // Check for server errors
          if (data['status'] == "error") {
            document.getElementById('error-feedback').style.display = "block";
            this.feedbackCard.hideFeedbackCard("error", data["error"]);
          } else {
            // No errors, get the outputs of the test cases
            this.testCasesReady = this.setOutputForTestCases(data);
            this.selectedTestCase = this.problemTestCases[0]; // First test case for the carousel
          }

        },
        error => {
          this.displayLoader = false; // Turn off loader
          document.getElementById('error-feedback').style.display = "block";
          this.feedbackCard.hideFeedbackCard("error", error);
        }
      );
  }


  /**
   * This function returns the view to the form to create a problem with the values already sent
   */
  goBackToForm(): void {
    this.testCasesReady = false;
    this.pendingCodeRestore = true;
  }

  /**
   * This function sends the request to Flask in order to create a new problem and save it to the Data Base
   */
  createProblemRequest() {

    //TODO: IMPLEMENT THE LOADER
    this.displayLoader = true; // display the loader

    let userID = JSON.parse(localStorage.getItem("userJson"))["id"];


    let problemObject = {
      "author_id": userID,
      "name": this.createProblemForm.value.problemDetails.problemName,
      "description_english": this.createProblemForm.value.problemDetails.engDescription,
      "description_spanish": this.createProblemForm.value.problemDetails.spnDescription,
      "topic_id": this.problemTopicID,
      "language": this.problemProgLang,
      "difficulty": this.problemDifficulty,
      "memory_limit": this.createProblemForm.value.problemDetails.memoryLimit,
      "time_limit": this.createProblemForm.value.problemDetails.timeLimit
    }


    if (this.problemTypeFlag == 0) {
      problemObject["code"] = this.problemSourceCode;

    } else {
      problemObject["code"] = this.problemFunctionCode;
      problemObject["template"] = this.problemTemplateCode;
      problemObject["signature"] = this.problemSignatureCode;
    }

    problemObject["test_cases"] = this.problemTestCases;


    this._httpProblemsService.createNewProblem(problemObject)
      .subscribe(
        data => {

          this.displayLoader = false;
          document.getElementById('success-feedback').style.display = "block";
          this.feedbackCard.hideFeedbackCard("success", "Problem successfully created!");

          setTimeout(() => {
            this._router.navigate(['/admin/tab/problems']);
          }, 2500);

        },
        error => {
          this.displayLoader = false;
          document.getElementById('error-feedback').style.display = "block";
          this.feedbackCard.hideFeedbackCard("error", error);
        }
      );


  }

}

