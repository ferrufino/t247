import {Injectable} from '@angular/core';
import {Http, Response} from "@angular/http";
import {environment} from '../../environments/environment';

@Injectable()
export class GroupsService {

  private baseURL: string = environment.apiURL + '/groups/';

  constructor(private http: Http) {
  }

  getGroups() {
    return this.http.get(this.baseURL).map((response: Response) => response.json());
  }

  getGroup(id) {
    return this.http
      .get(
        this.baseURL + id
      )
      .map((response: Response) => response.json());
  }
}
