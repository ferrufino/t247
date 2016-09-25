/**
 * Created by Alfredo Hinojosa on 9/23/2016.
 */

import { Injectable } from '@angular/core';


@Injectable()
export class ProblemDifficulties {

  getDifficulties(){
    var diff: string[] = ["Easy", "Medium", "Hard", "Extreme"];
    return diff;
  }

}
