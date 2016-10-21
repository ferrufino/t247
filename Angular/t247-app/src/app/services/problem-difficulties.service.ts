import { Injectable } from '@angular/core';

// TODO: DEPRECATED DELETE THIS SERVICE


@Injectable()
export class ProblemDifficulties {

    getDifficulties(){
        var diff: string[] = ["Easy", "Medium", "Hard", "Extreme"];
        return diff;
    }

}
