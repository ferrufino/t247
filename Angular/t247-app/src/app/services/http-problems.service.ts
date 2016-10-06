import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from "@angular/http";

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
    const headers = new Headers({'Content-Type': 'application/json'});

    return this.http.post('http://localhost:5000/api/evaluator/problem_creation', problem, headers)
      .map((data: Response) => data.json());
  }

}
