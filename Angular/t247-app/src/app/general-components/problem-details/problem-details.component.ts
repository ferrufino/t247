import {Component, OnInit} from '@angular/core';
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


  // Problem details
  problemName: string;
  descriptionEng: string;
  descriptionSpn: string;
  timeLimit: number;
  memoryLimit: number;
  problemTopic: string;
  problemLanguage: string;
  problemSource: string;
  problemDifficultyLabel: string;
  problemDifficultyId: number;
  authorName: string;
  authorId: number;
  problemTestCases: any[];
  selectedTestCase: any;
  testCaseIndex: number;

  constructor(private _problemService: ProblemsService,
              private _difficultiesService: ProblemDifficulties) {
  }

  ngOnInit() {

    var problemID = 32; //TODO: DELETE THIS LINE
    this.testCaseIndex = 0;

    this._problemService.getProblemInformation(problemID).subscribe(
      response => {
        console.log(response);

        let authorObject = response["author"];


        this.authorName = authorObject["first_name"] + " " + authorObject["last_name"];
        this.authorId = authorObject["id"];
        this.problemName = response["name"];
        this.descriptionEng = response["description_english"];
        this.descriptionSpn = response["description_spanish"];
        this.timeLimit = 1; response["time_limit"];
        this.memoryLimit = response["memory_limit"];
        this.problemSource = response["code"];
        this.problemLanguage = response["language"];
        this.problemDifficultyId = response["difficulty"];
        this.problemDifficultyLabel = this._difficultiesService.getDifficultyLabel(this.problemDifficultyId);
        this.problemTestCases = response["cases"];
        this.selectedTestCase = this.problemTestCases[0];
        this.problemTopic = response["topics"][0].name;
        console.log(this.selectedTestCase);

      },
      error => {
        console.log("Details not found of problem with ID: " + problemID);
      }
    );
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

  printCode($event){
    console.log($event);
  }

}
