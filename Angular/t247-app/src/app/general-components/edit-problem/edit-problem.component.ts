import {Component, OnInit, ViewChild} from "@angular/core";
import {FormGroup, Validators, FormBuilder} from "@angular/forms";
import {SupportedLanguages, ProgLanguage} from "../../services/supported-languages.service";
import {ProblemDifficulties} from "../../services/problem-difficulties.service";
import {EvaluatorService} from "../../services/evaluator.service";
import {TestCase} from "./TestCase";
import {TopicsService} from "../../services/topics.service";
import {ProblemsService} from "../../services/problems.service";
import {ActivatedRoute, Params, Router} from "@angular/router";

@Component({
  selector: 'edit-problem',
  providers: [SupportedLanguages, ProblemDifficulties, EvaluatorService],
  templateUrl: './edit-problem.component.html',
  styleUrls: ['./edit-problem.component.css']
})

export class EditProblem implements OnInit {

  // Local variables to the 4 code editors
  @ViewChild('fullCodeEditor') fullEditorComponent;
  @ViewChild('selectedLanguage') selectedLanguage;
  @ViewChild('functionCodeEditor') functionEditorComponent;
  @ViewChild('templateCodeEditor') templateEditorComponent;
  @ViewChild('signatureCodeEditor') signatureEditorComponent;
  @ViewChild('editor_english') editor_english;
  @ViewChild('editor_spanish') editor_spanish;

  @ViewChild('selectedDifficulty') selectedDifficulty;
  @ViewChild('selectedProblemTopic') selectedProblemTopic;


  // Feedback part
  @ViewChild('feedbackCard') feedbackCard;

  createProblemForm: FormGroup; // Form group to get the info of the problem
  displayLoader: boolean; // Flag used to display the loader when the form is submitted

  supportedLanguages: ProgLanguage[]; // filled from service
  problemTopics: any; // A list of all the topics available for a problem
  problemProgLang: string = ""; // The selected language of the problem

  difficulties: string[]; // filled from service
  problemDifficulty: string; // The selected difficulty of the problem
  problemTopicID: number = -1 // The id of the topic for this problem


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

  originalValues: any = {
    "timeLimit" : 0,
    "memoryLimit" : 0,
    "language" : "",
    "testCases" : [],
    "sourceCode" : "",
    "templateCode" : "",
    "signatureCode" : "",
    "problemTypeFlag" : 0
  };

  // Author details
  authorName: string;
  problemName: string;

  // Values stored for goBackFunction
  problemDifficultyIndex: number = -1;

  constructor(private _httpProblemsService: EvaluatorService,
              private _supportedLanguages: SupportedLanguages,
              private _problemDifficulties: ProblemDifficulties,
              private _topicsService: TopicsService,
              private _problemService: ProblemsService,
              private _formBuilder: FormBuilder,
              private _router: Router,
              private route: ActivatedRoute) {
    this.route.params.forEach((params: Params) => {
      this.problemId = +params['id'];
    });
  }

  problemId; 

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
    this.problemSourceCode = null;
    
    // This values are initialized to help as a template
    this.problemTemplateCode = `#include <iostream>
using namespace std;

//&function

int main() {
    int a, b;
    cin >> a >> b;
    cout << sum(a, b);
    return 0;
}`;

    ;
    this.problemFunctionCode = 'int sum(int a, int b) {' +
      ' return a + b;' +
      '};';
    this.problemSignatureCode = 'int sum(int a, int b){};';

    // Get the values from services
    this.difficulties = this._problemDifficulties.getDifficulties(); // Call the fake service

    // Get topics
    this._topicsService.getTopics().subscribe(
      response => {
        response.sort((a, b) => {
          return (a.name).localeCompare(b.name);
        });
        this.problemTopics = response;
        // Get languages
        this._supportedLanguages.getLanguages().subscribe(
          respose => {
            this.supportedLanguages = respose;
            // Load problem
            this._problemService.getProblemInformation(this.problemId).subscribe(
              response => {

                // Store problem's original values, which we will compare
                // in order to determine if problem has to be executed again
                // before updating its contents
                this.originalValues.timeLimit = response.time_limit;
                this.originalValues.memoryLimit = response.memory_limit;
                if (response.language == "C++") {
                   this.originalValues.language = "cpp";  
                } else {
                   this.originalValues.language = "java";
                }
                if (response.signature) {
                  this.originalValues.problemTypeFlag = 1;
                } else {
                  this.originalValues.problemTypeFlag = 0;
                }
                this.originalValues.testCases = JSON.parse(JSON.stringify(response.cases));
                this.originalValues.sourceCode = response.code;
                this.originalValues.functionCode = response.code;
                this.originalValues.templateCode = response.template;
                this.originalValues.signatureCode = response.signature;

                // Set problems contents
                this.problemName = response.name;
                let authorObject = response["author"];

                // Author details
                this.authorName = authorObject["first_name"] + " " + authorObject["last_name"];
                
                for (let i = 0; i < response.cases.length; i ++) {
                  response.cases[i].status = 'successful run';
                }

                this.problemTestCases = response.cases;

                // Restore source code depending on problem type
                if (response.signature) {
                  // Function problem
                  this.problemTypeFlag = 1;
                  
                  this.problemFunctionCode = response.code;
                  this.problemTemplateCode = response.template;
                  this.problemSignatureCode = response.signature;
                } else {
                  // Regular problem
                  this.problemTypeFlag = 0;
                  
                  this.fullEditorComponent.setNewSourceCode(response.code);
                }        

                // Set <select>'s values
                if (response.language == "C++") {
                  this.problemProgLang = "cpp";  
                } else {
                  this.problemProgLang = "java";
                }
                this.problemDifficultyIndex = Number(response.difficulty);
                this.problemTopicID = Number(response.topics[0].id);

                this.selectedLanguage.value = this.problemProgLang;
                this.selectedProblemTopic.value = this.problemTopicID;

                // Form validator
                this.createProblemForm.setValue({ 'problemDetails' :
                  {
                    'problemName' : response.name,
                    'engDescription': response.description_english,
                    'spnDescription': response.description_spanish,
                    'memoryLimit': response.memory_limit,
                    'timeLimit': response.time_limit
                  }
                });

                }
            );
          },
          error => {
            console.log("Error loading the supported languages!");
          }
        );
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

  // Method that checks if problem has to be re-evaluated
  isEvaluationRequired(selectedLanguage: string) {
    // Check if values have changed
    if (this.originalValues.timeLimit != this.createProblemForm.value.problemDetails.timeLimit ||
        this.originalValues.memoryLimit != this.createProblemForm.value.problemDetails.memoryLimit ||
        this.originalValues.language != selectedLanguage ||
        this.originalValues.problemTypeFlag != this.problemTypeFlag) {
      return true;
    }

    // If problem is regular problem, check that source code is still the same
    if (this.problemTypeFlag == 0 &&
        this.originalValues.sourceCode != this.fullEditorComponent.getSourceCode()) {
      return true;
    }

    // If problem is function problem, check that all source codes are still the same
    if (this.problemTypeFlag == 1 &&
          (this.originalValues.sourceCode != this.functionEditorComponent.getSourceCode() || 
           this.originalValues.templateCode != this.templateEditorComponent.getSourceCode() ||
           this.originalValues.signatureCode != this.signatureEditorComponent.getSourceCode())) {
      return true;
    }

    // Check if test cases have changed
    if (this.haveTestCasesChanged()) {
      return true
    }

    return false;
  }

  // Method that checks if test cases have changed
  haveTestCasesChanged() {
    // There are more or less test cases than originally
    if (this.originalValues.testCases.length != this.problemTestCases.length) {
      return true;
    }

    let inputs: string[] = this.getInputFromTestCases();

    // There are different test cases
    for (let i = 0; i < this.originalValues.testCases.length; i ++) {
      if (this.originalValues.testCases[i].input != inputs[i]) {
        return true;
      }
    }

    return false;
  }

  // Method that triggers problem re-evaluation or directly saves
  // changes after problem editing
  updateProblem(selectedLanguage: string, selectedDifficulty: string, selectedTopicId: number) {
    let requireEvaluation = this.isEvaluationRequired(selectedLanguage);

    if (requireEvaluation) {
      this.evaluteTestCases(selectedLanguage, selectedDifficulty, selectedTopicId)
    } else {
      this.partialProblemUpdateRequest(selectedDifficulty, selectedTopicId);
    }
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

    request["is_update"] = true;

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
  }

  // Method that saves problem when no re-evaluation was needed
  partialProblemUpdateRequest(selectedDifficulty: string, selectedTopicId: number) {

    this.problemTopicID = selectedTopicId;
    this.problemDifficulty = selectedDifficulty;

    let userID = JSON.parse(localStorage.getItem("userJson"))["id"];


    let problemObject = {
      "description_english": this.createProblemForm.value.problemDetails.engDescription,
      "description_spanish": this.createProblemForm.value.problemDetails.spnDescription,
      "topics": Number(this.problemTopicID),
      "difficulty": Number(this.problemDifficulty)
    }

    this._problemService.updateProblem(this.problemId, problemObject)
      .subscribe(
        data => {

          document.getElementById('success-feedback').style.display = "block";
          this.feedbackCard.hideFeedbackCard("success", "Problem successfully updated!");

          setTimeout(() => {
            this._router.navigate(['/' + JSON.parse(localStorage['userJson'])['role'] + '/tab/problems']);
          }, 2500);

        },
        error => {
          this.displayLoader = false;
          document.getElementById('error-feedback').style.display = "block";
          this.feedbackCard.hideFeedbackCard("error", error);
        }
      );

  }

  /**
   * This function sends the request to Flask in order to save changes to problem 
   * and save it to the Data Base (after re-evaluation)
   */
  updateProblemRequest() {

    //TODO: IMPLEMENT THE LOADER
    this.displayLoader = true; // display the loader

    let userID = JSON.parse(localStorage.getItem("userJson"))["id"];


    let problemObject = {
      "author_id": userID,
      "name": this.createProblemForm.value.problemDetails.problemName,
      "description_english": this.createProblemForm.value.problemDetails.engDescription,
      "description_spanish": this.createProblemForm.value.problemDetails.spnDescription,
      "topics": Number(this.problemTopicID),
      "language": this.problemProgLang,
      "difficulty": Number(this.problemDifficulty),
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

    problemObject["cases"] = this.problemTestCases;


    this._problemService.updateProblem(this.problemId, problemObject)
      .subscribe(
        data => {

          this.displayLoader = false;
          document.getElementById('success-feedback').style.display = "block";
          this.feedbackCard.hideFeedbackCard("success", "Problem successfully updated!");

          setTimeout(() => {
            this._router.navigate(['/' + JSON.parse(localStorage['userJson'])['role'] + '/tab/problems']);
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

