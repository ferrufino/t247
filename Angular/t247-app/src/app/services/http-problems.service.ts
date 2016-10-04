import { Injectable } from '@angular/core';
import { Http, Response, Headers } from "@angular/http";

import 'rxjs/Rx';
import { Observable } from "rxjs/Rx";

@Injectable()
export class HttpProblemsService {

  constructor(private http: Http) { }

  /**
   * This function sends through POST method an object to the evaluator in order
   * to get the corresponding "output" of the test cases
   * @param problem object with it's corresponding test cases
   * @returns {any} a json containing the outputs of the test cases sent
   */
  checkProblemTestCases(problem: any){
    const body = JSON.stringify(problem); // parse the problem to string
    return this.http.post('https://t247-testing.firebaseio.com/data.json', body)
      .map((data: Response) => data.json())
  }

}
