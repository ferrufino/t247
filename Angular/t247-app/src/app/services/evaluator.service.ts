import {Injectable} from '@angular/core';
import {Http, Response, Headers, RequestOptions} from "@angular/http";
import {environment} from '../../environments/environment';

import 'rxjs/Rx';
import {Observable} from "rxjs/Rx";

@Injectable()
export class EvaluatorService {

  constructor(private http: Http) {
  }

  /**
   * This function sends through POST method an object to the evaluator in order
   * to get the corresponding "output" of the test cases
   * @param problem object with it's corresponding test cases
   * @returns {any} a json containing the outputs of the test cases sent
   */
  checkProblemTestCases(problem: any) {
    const headers = new Headers({'Content-Type': 'application/json', 'Access-Control-Allow-Origin': 'localhost:4200', 'Authorization': localStorage.getItem('auth_token')});
    const options = new RequestOptions({headers: headers});

    const serviceURL: string = environment.apiURL + '/evaluator/problem_evaluation';


    return this.http.post(serviceURL, problem, options)
      .map((data: Response) => data.json());
  }

  createNewProblem(problem: any) {
    const headers = new Headers({'Content-Type': 'application/json', 'Access-Control-Allow-Origin': 'localhost:4200', 'Authorization': localStorage.getItem('auth_token')});
    const options = new RequestOptions({headers: headers});

    const PROBLEM_CREATION_URL : string = environment.apiURL + '/evaluator/problem_creation';

    return this.http.post(PROBLEM_CREATION_URL, problem, options)
      .map((data: Response) => data.json());
  }

  submitProblem(problem: any) {
    const headers = new Headers({'Content-Type': 'application/json', 'Access-Control-Allow-Origin': 'localhost:4200', 'Authorization': localStorage.getItem('auth_token')});
    const options = new RequestOptions({headers: headers});

    const submitProblemURL: string = environment.apiURL + '/evaluator/problem_submission';
    return this.http.post(submitProblemURL, problem, options)
      .map((data: Response) => data.json());
  }

}
