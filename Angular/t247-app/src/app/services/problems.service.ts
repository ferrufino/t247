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

    constructor(private http:Http) {
    }


    /**
     * This service returns all the information related to a problem
     * @param problemID: the ID of the problem
     * @returns {Observable<R>}
     */
    getProblemInformation(problemID:number) {
        const headers = new Headers({'Content-Type': 'application/json', 'Access-Control-Allow-Origin': 'localhost:4200', 'Authorization': localStorage.getItem('auth_token')});
        const options = new RequestOptions({headers: headers});

        return this.http.get(this.GET_PROBLEM_DATA_URL + problemID+ '/', options).map((response:Response) => response.json());
    }

    /**
     * This function returns a list of problems that have the same topic Id
     * @param id_topic
     * @param id_user
     * @returns {Observable<R>}
     */
    getProblemsFromTopic(id_topic, id_user) {
        const headers = new Headers({'Content-Type': 'application/json', 'Access-Control-Allow-Origin': 'localhost:4200', 'Authorization': localStorage.getItem('auth_token')});
        const options = new RequestOptions({headers: headers});

        return this.http.get(this.PROBLEM_BY_TOPIC_URL + id_user + '/' + id_topic, options).map((response:Response) => response.json());
    }

    /**
     * Returns the full list of problems created
     * @returns {Observable<R>}
     */
    getProblems() {
        const headers = new Headers({'Content-Type': 'application/json', 'Access-Control-Allow-Origin': 'localhost:4200', 'Authorization': localStorage.getItem('auth_token')});
        const options = new RequestOptions({headers: headers});

        return this.http.get(this.PROBLEM_LIST_URL, options).map((response:Response) => response.json());
    }

    /**
     * This function returns a code 204 when the problem is successfully` updated
     * @param problemID
     * @param problem
     * @returns {Observable<R>}
     */
    updateProblem(problemID: number, problem: any){
      const headers = new Headers({'Content-Type': 'application/json', 'Access-Control-Allow-Origin': 'localhost:4200', 'Authorization': localStorage.getItem('auth_token')});
      const options = new RequestOptions({headers: headers});

      return this.http.put(this.PROBLEM_UPDATE_URL + problemID, problem, options );
    }


    changeStatusOfProblem(problemId:number, status:number){
        const headers = new Headers({'Content-Type': 'application/json', 'Access-Control-Allow-Origin': 'localhost:4200', 'Authorization': localStorage.getItem('auth_token')});
        const options = new RequestOptions({headers: headers});

        console.log("changestatus");
        console.log(options);

        return this.http.put(this.PROBLEM_CHANGE_STATUS_URL + problemId + '/' + status, null, options);
    }

}

