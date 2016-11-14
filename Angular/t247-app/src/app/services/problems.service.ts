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
  private PROBLEM_BY_TOPIC_URL = environment.apiURL + '/problems/listbytopic/';
  private PROBLEM_UPDATE_URL = environment.apiURL + '/problems/';

  constructor(private http: Http) {}


  /**
   * This service returns all the information related to a problem
   * @param problemID: the ID of the problem
   * @returns {Observable<R>}
   */
  getProblemInformation(problemID: number) {
    return this.http.get(this.GET_PROBLEM_DATA_URL + problemID).map((response: Response) => response.json());
  }

  getProblemsFromTopic(id_topic, id_user) {
    return this.http.get(this.PROBLEM_BY_TOPIC_URL + id_user + '/' + id_topic).map((response: Response) => response.json());
  }

  getProblems() {
    return this.http.get(this.PROBLEM_LIST_URL).map((response: Response) => response.json());
  }

  updateProblem(problemID: number, problem: any){
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': 'localhost:4200'
    });
    return this.http.put(this.PROBLEM_UPDATE_URL + problemID, problem, headers ).map((response: Response) => response.json());
  }


}

