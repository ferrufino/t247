import {Injectable} from '@angular/core';
import {Http, Response, Headers} from "@angular/http";
import {environment} from '../../environments/environment';

@Injectable()
export class AssignmentsService {

  private baseURL: string = environment.apiURL + '/assignments/';
  private createURL: string = environment.apiURL + '/assignments/create';

  private headers = new Headers({'Content-Type': 'application/json'});

  constructor(private http: Http) {
  }

  getAssignments() {
    return this.http.get(this.baseURL).map((response: Response) => response.json());
  }

  getSubmissions(id) {
    return this.http
      .get(
        this.baseURL + id  + '/submissions'
      )
      .map((response: Response) => response.json());
  }

  createAssignment(assignment){
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
