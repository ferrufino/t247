import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from "@angular/http";

import 'rxjs/Rx';
import { Observable } from "rxjs/Rx";

@Injectable()
export class EvaluatorService {

  constructor(private http: Http) { }

  /**
   * This function sends through POST method an object to the evaluator in order
   * to get the corresponding "output" of the test cases
   * @param problem object with it's corresponding test cases
   * @returns {any} a json containing the outputs of the test cases sent
   */
  checkProblemTestCases(problem: any){
    const headers = new Headers({'Content-Type': 'application/json', 'Access-Control-Allow-Origin': 'localhost:4200'});
    const serviceURL : string = 'http://107.170.255.106:5000/api/evaluator/problem_evaluation';

    //const serviceURL : string = 'https://t247-testing.firebaseio.com/data.json';

    return this.http.post(serviceURL, problem, headers)
      .map((data: Response) => data.json());
  }

  createNewProblem(problem: any){
    const headers = new Headers({'Content-Type': 'application/json', 'Access-Control-Allow-Origin': 'localhost:4200'});
    //http://cors.io/?
    return this.http.post('http://107.170.255.106:5000/api/evaluator/problem_creation', problem, headers)
      .map((data: Response) => data.json());
  }

}