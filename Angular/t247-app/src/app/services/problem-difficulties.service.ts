import { Injectable } from '@angular/core';

@Injectable()
export class ProblemDifficulties {

    getDifficulties(){
        var diff: string[] = ["Easy", "Medium", "Hard"];
        return diff;
    }

}
