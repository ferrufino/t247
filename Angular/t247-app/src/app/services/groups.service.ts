import {Injectable} from '@angular/core';
import {Http, Response} from "@angular/http";
import {environment} from '../../environments/environment';

@Injectable()
export class GroupsService {

  private baseURL: string = environment.apiURL + '/users';

  constructor(private http: Http) {
  }

  getGroups() {
    const serviceURL: string = 'http://107.170.255.106:5000/api/groups/';
    return this.http.get(serviceURL).map((response: Response) => response.json());
  }

  getGroup(id) {
    return this.http
      .get(
        this.baseURL + id
      )
      .map((response: Response) => response.json());
  }
}
