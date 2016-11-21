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
    private PROBLEM_CHANGE_STATUS_URL = environment.apiURL + '/problems/changestatus/';

    private headers = new Headers({'Content-Type': 'application/json','Access-Control-Allow-Origin': 'localhost:4200', 'Authorization': localStorage.getItem('auth_token')});
    private options = new RequestOptions({headers: this.headers});

    constructor(private http:Http) {
    }


    /**
     * This service returns all the information related to a problem
     * @param problemID: the ID of the problem
     * @returns {Observable<R>}
     */
    getProblemInformation(problemID:number) {
        return this.http.get(this.GET_PROBLEM_DATA_URL + problemID, this.options).map((response:Response) => response.json());
    }

    /**
     * This function returns a list of problems that have the same topic Id
     * @param id_topic
     * @param id_user
     * @returns {Observable<R>}
     */
    getProblemsFromTopic(id_topic, id_user) {
        return this.http.get(this.PROBLEM_BY_TOPIC_URL + id_user + '/' + id_topic, this.options).map((response:Response) => response.json());
    }

    /**
     * Returns the full list of problems created
     * @returns {Observable<R>}
     */
    getProblems() {
        return this.http.get(this.PROBLEM_LIST_URL, this.options).map((response:Response) => response.json());
    }

    /**
     * This function returns a code 204 when the problem is successfully` updated
     * @param problemID
     * @param problem
     * @returns {Observable<R>}
     */
    updateProblem(problemID: number, problem: any){
      return this.http.put(this.PROBLEM_UPDATE_URL + problemID, problem, this.headers );
    }


    changeStatusOfProblem(problemId:number, status:number){
        return this.http.put(this.PROBLEM_CHANGE_STATUS_URL + problemId + '/'+status, this.headers);
    }

}

