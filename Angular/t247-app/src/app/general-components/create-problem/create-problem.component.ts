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
  problemProgLang: ProgLanguage; // The selected language of the problem
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
    this.problemProgLang = this.supportedLanguages[0];
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


  updateSelectedTestCase(): any {
    this.selectedTestCase = this.problemTestCases[this.testCaseIndex];
  }

  previousTestCase(): any {
    let actual = this.testCaseIndex - 1;
    this.testCaseIndex = (actual < 0) ? this.problemTestCases.length - 1 : actual;
    this.updateSelectedTestCase();
  }

  nextTestCase(): any {
    let actual = this.testCaseIndex + 1;
    this.testCaseIndex = (actual > this.problemTestCases.length - 1) ? 0 : actual;
    this.updateSelectedTestCase();
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
        "language": this.problemProgLang.value,
        "difficulty": this.problemDifficulty,
        "memoryLimit": this.createProblemForm.value.problemDetails.memoryLimit,
        "timeLimit": this.createProblemForm.value.problemDetails.timeLimit,
        "type": pType
      }

    problemObject["testCases"] = this.problemTestCases;

    console.log(problemObject);


  }

  /**
   * This function sends the code and the test cases to the evaluator in order to get the
   * correct output for each test case.
   *
   * This functions connects to the HTTP PROBLEMS SERVICE
   */
  evaluteTestCases() {

    let inputs: string[] = this.getInputFromTestCases(); // test cases input strings
    let sourceCode: string = ""; // string with the source code of the project

    let dummy = {
      "status": "compiled successfully",
      "test_cases": [
        {"status": "successful run", "output": "178"},
        {"status": "successful run", "output": "200"},
        {"status": "successful run", "output": "44"}
      ]
    };

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

    // The object that will be sent to the evaluator
    let request = {
      "request_type": "creation",
      "code": sourceCode,
      "language": this.problemProgLang.value,
      "time_limit": this.createProblemForm.value.problemDetails.timeLimit,
      "memory_limit": this.createProblemForm.value.problemDetails.memoryLimit,
      "test_cases": inputs
    };

    this._httpProblemsService.checkProblemTestCases(request)
      .subscribe(
        data => {
          console.log(data) // TODO: Use this data, not the dummy one

          let aux = {};

          this.testCasesReady = true;
          this.selectedTestCase = this.problemTestCases[0];

          for (let i = 0; i < this.problemTestCases.length; i++) {

            aux = dummy.test_cases[i];

            if (aux["status"] == "successful run") {
              this.problemTestCases[i].output = aux["output"];
            } else {
              this.testCasesReady = false;
            }

            this.problemTestCases[i].status = aux["status"];

          }

          console.log(this.problemTestCases);

        }
      );
  }
}
