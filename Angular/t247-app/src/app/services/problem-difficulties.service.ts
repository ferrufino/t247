import {Injectable} from '@angular/core';

@Injectable()
export class ProblemDifficulties {

  private difficulties: string[] = ["Easy", "Medium", "Hard"];

  /**
   * Returns the corresponding label of the difficulty if the index is inside the range
   * if not, then it'll return the string "No difficulty"
   * @param id
   * @returns {string} a difficulty string
   */
  getDifficultyLabel(id: number) {

    if (id >= 0 && id < this.difficulties.length) {
      return this.difficulties[id];
    } else {
      return "undefined";
    }

  }

  /**
   * Returns the difficulties array
   * @returns {any} string array with the difficulties
   */
  getDifficulties() {
    return this.difficulties;
  }

}
