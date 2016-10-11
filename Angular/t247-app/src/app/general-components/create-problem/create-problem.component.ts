/**
 * Created by Alfredo Hinojosa on 9/22/2016.
 */

import {Component} from '@angular/core';
import {
  FormGroup,
  Validators,
  FormBuilder,
} from "@angular/forms";

import {SupportedLanguages, ProgLanguage} from "../../services/supported-languages.service";
import {ProblemDifficulties} from "../../services/problem-difficulties.service";
import {HttpProblemsService} from "../../services/http-problems.service";
import {TestCase} from "./TestCase";

@Component({
  selector: 'create-problem',
  providers: [SupportedLanguages, ProblemDifficulties, HttpProblemsService],
  templateUrl: './create-problem.component.html',
  styleUrls: ['./create-problem.component.css']
})

export class CreateProblem {

  createProblemForm: FormGroup; // Form group to get the info of the problem
  supportedLanguages: ProgLanguage[]; // filled from service
  difficulties: string[] // filled from service
  problemProgLang: string; // The selected language of the problem
  problemDifficulty: string; // The selected difficulty of the problem
  problemTestCases: TestCase[]; // The array of test cases realted to the problem
  testCasesReady: boolean; // Flag that when is true means that all test cases passed the check
  testCaseIndex: number; // Number that is equal to the index of the displayed test case
  selectedTestCase: TestCase; // Current Test Case being displayed

  // This variable specifies the form type that will be displayed, in order to upload the problem
  // 0 = default value, 1 = full problem, 2 = function
  problemTypeFlag: number = 0;


  constructor(private _httpProblemsService: HttpProblemsService,
              private _supportedLanguages: SupportedLanguages,
              private _problemDifficulties: ProblemDifficulties,
              private _formBuilder: FormBuilder) {
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

    this.supportedLanguages = this._supportedLanguages.getLanguages();
    this.difficulties = this._problemDifficulties.getDifficulties();

    // TODO: FIX THESE! HARDCODED VALUES
    this.problemProgLang = 'test';
    this.problemDifficulty = this.difficulties[0];


    // Create the problem form object
    this.createProblemForm = this._formBuilder.group({

      'problemDetails': this._formBuilder.group({
        'problemName': ['', Validators.required],
        'engDescription': ['', Validators.required],
        'spnDescription': ['', Validators.required],
        'memoryLimit': ['', Validators.required],
        'timeLimit': ['', Validators.required]
      }),
      'problemSourceFull': this._formBuilder.group({
        'code': ['']
      }),
      'problemSourceFunction': this._formBuilder.group({
        'firstHalf': [''],
        'functionCode': [''],
        'secondHalf': ['']
      })

    });

  }


  /**
   * This function obtains the input for all the test cases and returns them as a string array.
   * @returns {string[]} containing all the inputs for each test case
   */
  getInputFromTestCases(): string[] {

    let inputs: string[] = [];

    for (let i = 0; i < this.problemTestCases.length; i++) {
      inputs.push(this.problemTestCases[i].content); // The content property = inputs
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

    var sourceCode: string;

    switch (this.problemTypeFlag) {
      case 1:
        sourceCode = this.createProblemForm.value.problemSourceFull.code
        break;
      case 2:
        sourceCode = this.createProblemForm.value.problemSource.problemSourceFunction.firstHalf +
          this.createProblemForm.value.problemSource.problemSourceFunction.functionCode +
          this.createProblemForm.value.problemSource.problemSourceFunction.secondHalf;
        break;
    }

    return sourceCode;
  }


  createProblemRequest() {

    // TODO: GET CORRECT VALUE OF DIFFICULTY AND LANGUAGE
    // TODO: FIX TEXT AREA VALUE

    // Get the correct type of problem
    let pType = (this.problemTypeFlag == 1) ? "full" : "function";

    let problemObject = {
      "authorID": 484,
      "name": this.createProblemForm.value.problemDetails.problemName,
      "descriptionEnglish": this.createProblemForm.value.problemDetails.engDescription,
      "descriptionSpanish": this.createProblemForm.value.problemDetails.spnDescription,
      "language": this.problemProgLang,
      "difficulty": this.problemDifficulty,
      "memoryLimit": this.createProblemForm.value.problemDetails.memoryLimit,
      "timeLimit": this.createProblemForm.value.problemDetails.timeLimit,
      "type": pType
    }

    problemObject["testCases"] = this.problemTestCases;

    console.log(problemObject);

    this._httpProblemsService.createNewProblem(problemObject)
      .subscribe(
        data => {
          console.log("RESPONSE")
          console.log(data) // TODO: Use this data, not the dummy one


        }
      );

  }

  /**
   * GET OUTPUT OF TEST CASES
   * This function sends the code and the test cases to the evaluator in order to get the
   * correct output for each test case.
   *
   * This functions connects to the HTTP PROBLEMS SERVICE
   */
  evaluteTestCases() {

    let inputs: string[] = this.getInputFromTestCases(); // test cases input strings
    let sourceCode: string = this.getSourceCodeString(); // string with the source code of the project

    // TODO: DELETE HIS DUMMY DATA
    let dummy = {
      "status": "compiled successfully",
      "test_cases": [
        {"status": "successful run", "output": "178"},
        {"status": "successful run", "output": "200"},
        {"status": "successful run", "output": "44"}
      ]
    };


    // The object that will be sent to the evaluator
    let request = {
      "request_type": "creation",
      "code": sourceCode,
      "language": this.problemProgLang,
      "time_limit": this.createProblemForm.value.problemDetails.timeLimit,
      "memory_limit": this.createProblemForm.value.problemDetails.memoryLimit,
      "test_cases": inputs
    };

    // TODO: DELETE THESE LINES
    console.log("Test request..");
    console.log(request);

    // Make the POST
    this._httpProblemsService.checkProblemTestCases(request)
      .subscribe(
        data => {
          console.log("RESPONSE")
          console.log(data) // TODO: delete this log

          let aux = {};

          this.testCasesReady = true; // Assume the form is ready for next step
          this.selectedTestCase = this.problemTestCases[0]; // First test case for the carousel

          for (let i = 0; i < this.problemTestCases.length; i++) {

            aux = data.test_cases[i];

            if (aux["status"] == "successful run") {
              this.problemTestCases[i].output = aux["output"]; // Set the output to the respective test case
            } else {
              this.testCasesReady = false; // Error in test case, the form is not ready for next step
            }

            this.problemTestCases[i].status = aux["status"]; // Set the status to the respective test case
          }
        }
      );
  }
}

