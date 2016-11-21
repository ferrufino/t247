import {Injectable} from '@angular/core';
import {Http, Response, Headers, RequestOptions} from "@angular/http";
import {environment} from '../../environments/environment';

@Injectable()
export class AssignmentsService {

    private baseURL:string = environment.apiURL + '/assignments/';
    private userURL:string = environment.apiURL + '/assignments/bystudent';
    private createURL:string = environment.apiURL + '/assignments/create';

    private headers = new Headers({'Content-Type': 'application/json', 'Access-Control-Allow-Origin': 'localhost:4200', 'Authorization': localStorage.getItem('auth_token')});

    private options = new RequestOptions({headers: this.headers});

    constructor(private http:Http) {
    }

    getAssignments() {
        return this.http.get(this.userURL, this.options).map((response:Response) => response.json());
    }
  getAssignmentsByStudent(id) {

    console.log("HEADER-ASSIGNMENTS");
        console.log(this.options);

    return this.http.get(
        this.baseURL + 'bystudent/'+id,
        this.options
    ).map((response: Response) => response.json());
  }

    getSubmissions(id) {
        return this.http
            .get(
                this.baseURL + id + '/submissions',
                this.options
            )
            .map((response:Response) => response.json());
    }

    createAssignment(assignment) {
        return this.http
            .post(
                this.createURL,
                assignment,
                this.headers
            )
            .map(res => {
                return res;
            });
    }

}
