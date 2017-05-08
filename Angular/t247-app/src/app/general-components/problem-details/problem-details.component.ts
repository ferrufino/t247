import {Component, OnInit, ViewChild, ChangeDetectorRef} from '@angular/core';
import {ProblemsService} from "../../services/problems.service";
import {ProblemDifficulties} from "../../services/problem-difficulties.service";
import {TestCase} from "../create-problem/TestCase";
import {ActivatedRoute, Params, Router}   from '@angular/router';
import {FormGroup, FormBuilder, Validators, FormControl} from "@angular/forms";
declare var jQuery:any;


@Component({
  selector: 'app-problem-details',
  providers: [ProblemDifficulties],
  templateUrl: './problem-details.component.html',
  styleUrls: ['./problem-details.component.css']
})
export class ProblemDetailsComponent implements OnInit {

  // Feedback part
  @ViewChild('feedbackCard') feedbackCard;

  @ViewChild('codeEditor') editorComponet;
  @ViewChild('signatureCodeEditor') signatureEditorComponet;
  @ViewChild('templateCodeEditor') templateEditorComponet;

  @ViewChild('descriptionEnglish') descriptionEnglish;
  @ViewChild('descriptionSpanish') descriptionSpanish;

  private userInformationObject: any; // Used to check if the user can edit the problem
  private problemId;
  // Author details
  authorName: string;
  authorId: number;

  // Problem information
  problemName: string;
  descriptionEng: string;
  descriptionSpn: string;
  isTemplateProblem: boolean; // This flags indicates if a problem has a template

  // Problem details
  timeLimit: number;
  memoryLimit: number;
  problemTopic: string;
  problemLanguage: string;
  problemDifficultyLabel: string;
  problemDifficultyId: number;
  problemTopics: any;

  // Problem source code
  problemSource: string;
  problemSignature: string;
  problemTemplate: string;

  // Test cases
  problemTestCases: TestCase[];
  selectedTestCase: TestCase;
  testCaseIndex: number;

  // To Edit problem
  editProblemForm: FormGroup; // Form group to get the info of the problem
  difficulties: string[]; // filled from service

  constructor(private _problemService: ProblemsService,
              private  cdr: ChangeDetectorRef,
              private _formBuilder: FormBuilder,
              private _difficultiesService: ProblemDifficulties,
              private route: ActivatedRoute,
              private router: Router) {
  }

  ngOnInit() {

    this.isTemplateProblem = false;
    this.problemSource = "";
    this.problemSignature = "";
    this.problemTemplate = "";
    this.problemName = "";
    this.descriptionEng = ""
    this.descriptionSpn = ""
    this.difficulties = this._difficultiesService.getDifficulties(); // Call the fake service

    this.route.params.forEach((params: Params) => {
      this.problemId = +params['id'];
      this._problemService.getProblemInformation(this.problemId).subscribe(
        response => {
          console.log(response);

          let authorObject = response["author"];

          // Author details
          this.authorName = authorObject["first_name"] + " " + authorObject["last_name"];
          this.authorId = authorObject["id"];

          // Problem information
          this.problemName = response["name"];
          this.descriptionEnglish.nativeElement.innerHTML = response["description_english"];
          this.descriptionSpanish.nativeElement.innerHTML = response["description_spanish"];

          // Problem details
          this.timeLimit = response["time_limit"];
          this.memoryLimit = response["memory_limit"];
          this.problemLanguage = response["language"];
          this.problemDifficultyId = response["difficulty"];
          this.problemDifficultyLabel = this._difficultiesService.getDifficultyLabel(this.problemDifficultyId);
          this.problemTopics = response["topics"];
          this.problemTopic = this.problemTopics[0].name;


          // Check if the problem has a template
          if (response["template"] !== null) {

            this.isTemplateProblem = true;
            this.problemSignature = response["signature"];
            this.problemTemplate = response["template"];

            this.signatureEditorComponet.setNewSourceCode(this.problemSignature);
            this.templateEditorComponet.setNewSourceCode(this.problemTemplate);

          }

          // Problem source code
          this.problemSource = response["code"];
          this.editorComponet.setNewSourceCode(this.problemSource);


          // Test cases
          this.createTestCases(response["cases"]);
          this.selectedTestCase = this.problemTestCases[0];


        },
        error => {
          console.log("Details not found of problem with ID: " + this.problemId);
        }
      );

    });

    // Create the problem form object
    this.editProblemForm = this._formBuilder.group({

      'problemDetails': this._formBuilder.group({
        'engDescription': ['', this.emptyDescriptionValidator],
        'spnDescription': ['', this.emptyDescriptionValidator]
      })

    });


    // These declarations are here because the upper part us async, so these lines prevent
    // a null pointer exception
    this.testCaseIndex = 0;
    this.problemTestCases = [];
    this.selectedTestCase = new TestCase(false, "Loading..", "Loading..", "Loading..");
    this.userInformationObject = JSON.parse(localStorage.getItem("userJson"));
    console.log("Problem id in problem details " + this.problemId);

  }

  updateFormValues(){

    let formObject : any;
    formObject  = this.editProblemForm.controls['problemDetails'];
    formObject.controls['engDescription'].setValue(this.descriptionEng);
    formObject.controls['spnDescription'].setValue(this.descriptionSpn);
  }


  emptyDescriptionValidator(control:FormControl) : {[s : string] : boolean} {

    if(control.value === ""){
      return {test : true}; // is empty
    }

    return null; // is not empty
  }

  goToEditProblem() {
    this.router.navigate(['/editProblem', this.problemId]);
  }

  /**
   * This function recieves the data from the service and pushes TestCase objects to the array
   * @param data
   */
  createTestCases(data): void {

    for (let i = 0; i < data.length; i++) {
      let temp = data[i];
      this.problemTestCases.push(new TestCase(temp["is_sample"], temp["input"], temp["output"], temp["feedback"]));
    }

  }

  /**
   * This function checks if the current user is the same one that created the problem OR the user is admin
   * @returns {boolean} true if the user can edit this problem
   */
  canEditProblem() {
    return this.userInformationObject.id === this.authorId || this.userInformationObject.role === 'admin';
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


}
