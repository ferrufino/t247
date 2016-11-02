import {Injectable} from '@angular/core';

import '../rxjs-operators';
import 'rxjs/add/operator/map';
import {Headers, Http, Response, RequestOptions} from '@angular/http';
import {environment} from "../../environments/environment";


@Injectable()
export class ProblemsService {

  // API / URLs
  private PROBLEM_LIST_URL = environment.apiURL + '/problems/list/';
  private GET_PROBLEM_DATA_URL = environment.apiURL + '/problems/';

  constructor(private http: Http) {
  }


  /**
   * This service returns all the information related to a problem
   * @param problemID: the ID of the problem
   * @returns {Observable<R>}
   */
  getProblemInformation(problemID: number) {
    return this.http.get(this.GET_PROBLEM_DATA_URL + problemID).map((response: Response) => response.json());
  }

  getProblems() {
    return this.http.get(this.PROBLEM_LIST_URL).map((response: Response) => response.json());
  }

}
