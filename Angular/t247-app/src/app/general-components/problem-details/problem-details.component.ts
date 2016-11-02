import {Component, OnInit} from '@angular/core';
import {ProblemsService} from "../../services/problems.service";
import {ProblemDifficulties} from "../../services/problem-difficulties.service";


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
  problemLanguage: string;
  problemSource: string;
  problemDifficultyLabel: string;
  problemDifficultyId: number;


  constructor(private _problemService: ProblemsService,
              private _difficultiesService: ProblemDifficulties) {
  }

  ngOnInit() {

    var problemID = 25; //TODO: DELETE THIS LINE

    this._problemService.getProblemInformation(problemID).subscribe(
      response => {
        console.log(response);

        this.problemName = response["name"];
        this.descriptionEng = response["description_english"];
        this.descriptionSpn = response["description_spanish"];
        this.timeLimit = 1; // TODO: Remove this value
        this.memoryLimit = 100; // TODO: Remove this value
        this.problemLanguage = response["language"];
        this.problemDifficultyId = response["difficulty"];
        this.problemDifficultyLabel = this._difficultiesService.getDifficultyLabel(this.problemDifficultyId);

      },
      error => {
        console.log("Details not found of problem with ID: " + problemID);
      }
    );
  }

  printCode($event){
    console.log($event);
  }

}
