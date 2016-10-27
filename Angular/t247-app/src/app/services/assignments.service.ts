import {Injectable} from '@angular/core';
import {Http, Response} from "@angular/http";
import {environment} from '../../environments/environment';

@Injectable()
export class AssignmentsService {

  private baseURL: string = environment.apiURL + '/assignments/';

  constructor(private http: Http) {
  }

  getAssignments() {
    return this.http.get(this.baseURL).map((response: Response) => response.json());
  }

  getSubmissions(id) {
    return this.http
      .get(
        this.baseURL + 'submissions/' + id
      )
      .map((response: Response) => response.json());
  }
}
