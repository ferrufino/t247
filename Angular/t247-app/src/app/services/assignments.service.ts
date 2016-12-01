import {Injectable} from '@angular/core';
import {Http, Response, Headers, RequestOptions} from "@angular/http";
import {environment} from '../../environments/environment';

@Injectable()
export class AssignmentsService {

    private baseURL:string = environment.apiURL + '/assignments/';
    private userURL:string = environment.apiURL + '/assignments/bystudent';
    private createURL:string = environment.apiURL + '/assignments/create';
    private submissionsURL:string = environment.apiURL +'/assignments/studentsubmissionscode/';
    constructor(private http:Http) {
    }

    getAssignments() {
        const headers = new Headers({'Content-Type': 'application/json', 'Access-Control-Allow-Origin': 'localhost:4200', 'Authorization': localStorage.getItem('auth_token')});
        const options = new RequestOptions({headers: headers});

        return this.http.get(this.userURL, options).map((response:Response) => response.json());
    }

  getAssignmentsByStudent(id) {

    const headers = new Headers({'Content-Type': 'application/json', 'Access-Control-Allow-Origin': 'localhost:4200', 'Authorization': localStorage.getItem('auth_token')});
    const options = new RequestOptions({headers: headers});

    return this.http.get(
        this.baseURL + 'bystudent/'+id,
        options
    ).map((response: Response) => response.json());
  }


    getSubmissions(id) {
        const headers = new Headers({'Content-Type': 'application/json', 'Access-Control-Allow-Origin': 'localhost:4200', 'Authorization': localStorage.getItem('auth_token')});
        const options = new RequestOptions({headers: headers});

        return this.http
            .get(
                this.baseURL + id + '/submissions',
                options
            )
            .map((response:Response) => response.json());
    }

    createAssignment(assignment) {
        const headers = new Headers({'Content-Type': 'application/json', 'Access-Control-Allow-Origin': 'localhost:4200', 'Authorization': localStorage.getItem('auth_token')});
        const options = new RequestOptions({headers: headers});

        return this.http
            .post(
                this.createURL,
                assignment,
                options
            )
            .map(res => {
                return res;
            });
    }

    editAssignment(assignment) {
      const headers = new Headers({'Content-Type': 'application/json', 'Access-Control-Allow-Origin': 'localhost:4200', 'Authorization': localStorage.getItem('auth_token')});
      const options = new RequestOptions({headers: headers});
      let id = assignment.id;
      return this.http
        .put(
          this.baseURL + id,
          assignment,
          options
        )
        .map(res => {
          return res;
        });
  }

    deleteAssignment(id) {
        const headers = new Headers({'Content-Type': 'application/json', 'Access-Control-Allow-Origin': 'localhost:4200', 'Authorization': localStorage.getItem('auth_token')});
        const options = new RequestOptions({headers: headers});

        return this.http.delete(this.baseURL + id, options).map(res => res);
    }

    getSubmissionsOfAssignment(assign_id, student_id){
        const headers = new Headers({'Content-Type': 'application/json', 'Access-Control-Allow-Origin': 'localhost:4200', 'Authorization': localStorage.getItem('auth_token')});
        const options = new RequestOptions({headers: headers});

        return this.http
            .get(
                this.submissionsURL + assign_id + '/' + student_id,
                options
            )
            .map((response:Response) => response.json());
    }
}
