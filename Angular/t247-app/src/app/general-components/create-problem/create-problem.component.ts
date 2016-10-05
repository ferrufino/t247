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

  createProblemForm: FormGroup;
  supportedLanguages: ProgLanguage[]; // filled from service
  difficulties: string[] // filled from service
  problemProgLang: ProgLanguage;
  problemDifficulty: string;
  problemTestCases: TestCase[];

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

    this.problemTestCases = [];

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
        {"status": "time limit exceeded"},
        {"status": "runtime error"}
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
          console.log("RESPONSE")
          console.log(data) // TODO: Use this data, not the dummy one

          let aux = {};

          for (let i = 0; i < this.problemTestCases.length; i++) {

            aux = data.test_cases[i];

            if (aux["status"] == "successful run") {
              this.problemTestCases[i].output = aux["output"];
            }
            this.problemTestCases[i].status = aux["status"];

          }

          console.log(this.problemTestCases);

        }
      );
  }
}

