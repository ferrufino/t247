import {Component, OnInit, ViewChild} from '@angular/core';
import {ProblemsService} from "../../services/problems.service";
import {ProblemDifficulties} from "../../services/problem-difficulties.service";
import {TestCase} from "../create-problem/TestCase";


@Component({
  selector: 'app-problem-details',
  providers: [ProblemDifficulties],
  templateUrl: './problem-details.component.html',
  styleUrls: ['./problem-details.component.css']
})
export class ProblemDetailsComponent implements OnInit {
  @ViewChild('codeEditor') editorComponet

  private userInformationObject: any; // Used to check if the user can edit the problem

  // Author details
  authorName: string;
  authorId: number;

  // Problem information
  problemName: string;
  descriptionEng: string;
  descriptionSpn: string;

  // Problem details
  timeLimit: number;
  memoryLimit: number;
  problemTopic: string;
  problemLanguage: string;
  problemDifficultyLabel: string;
  problemDifficultyId: number;

  // Problem source code
  problemSource: string;

  // Test cases
  problemTestCases: TestCase[];
  selectedTestCase: TestCase;
  testCaseIndex: number;

  constructor(private _problemService: ProblemsService,
              private _difficultiesService: ProblemDifficulties) {
  }

  ngOnInit() {

    var problemID = 28; //TODO: DELETE THIS LINE
    this.testCaseIndex = 0;
    this.problemTestCases = [];
    this.selectedTestCase = new TestCase(false, "Loading..", "Loading..", "Loading..");
    this.userInformationObject = JSON.parse(sessionStorage.getItem("userJson"));

    this._problemService.getProblemInformation(problemID).subscribe(
      response => {
        console.log(response);

        let authorObject = response["author"];

        // Author details
        this.authorName = authorObject["first_name"] + " " + authorObject["last_name"];
        this.authorId = authorObject["id"];

        // Problem information
        this.problemName = response["name"];
        this.descriptionEng = response["description_english"];
        this.descriptionSpn = response["description_spanish"];

        // Problem details
        this.timeLimit = response["time_limit"];
        this.memoryLimit = response["memory_limit"];
        this.problemLanguage = response["language"];
        this.problemDifficultyId = response["difficulty"];
        this.problemDifficultyLabel = this._difficultiesService.getDifficultyLabel(this.problemDifficultyId);
        this.problemTopic = response["topics"][0].name;

        // Problem source code
        this.problemSource = response["code"];
        this.editorComponet.setNewSourceCode(this.problemSource);

        // Test cases
        this.createTestCases(response["cases"]);
        this.selectedTestCase = this.problemTestCases[0];


      },
      error => {
        console.log("Details not found of problem with ID: " + problemID);
      }
    );
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
  canEditProblem(){
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
