import {Injectable} from '@angular/core';
import {Http, Response, Headers, RequestOptions} from "@angular/http";
import {environment} from '../../environments/environment';

import {CacheService} from 'ng2-cache/src/services/cache.service';

@Injectable()
export class GroupsService {

  private baseURL: string = environment.apiURL + '/groups/';

  private createUrl = this.baseURL+'create';


  constructor(private http: Http, private _cacheService: CacheService) {
  }

  getGroups() {
    const headers = new Headers({'Content-Type': 'application/json', 'Access-Control-Allow-Origin': 'localhost:4200', 'Authorization': localStorage.getItem('auth_token')});
    const options = new RequestOptions({headers: headers});

    return this.http.get(this.baseURL, options).map((response: Response) => response.json());
  }

  getGroup(id) {
    const headers = new Headers({'Content-Type': 'application/json', 'Access-Control-Allow-Origin': 'localhost:4200', 'Authorization': localStorage.getItem('auth_token')});
    const options = new RequestOptions({headers: headers});

    return this.http
      .get(
        this.baseURL + id, options
      )
      .map((response: Response) => response.json());
  }

  createGroup(group){
    const headers = new Headers({'Content-Type': 'application/json', 'Access-Control-Allow-Origin': 'localhost:4200', 'Authorization': localStorage.getItem('auth_token')});
    const options = new RequestOptions({headers: headers});

    this._cacheService.set('groups', [], {expires: Date.now() - 1});
    this._cacheService.set('users', [], {expires: Date.now() - 1});

    return this.http
    .post(
      this.createUrl,
      {"course_id":group.course_id,"enrollments":group.enrollments,"period":group.period,"professor_id":group.professor},
      options
    )
    .map(res => {
      return res;
    });
  }

  deleteGroup(group){
    const headers = new Headers({'Content-Type': 'application/json', 'Access-Control-Allow-Origin': 'localhost:4200', 'Authorization': localStorage.getItem('auth_token')});
    const options = new RequestOptions({headers: headers});

    this._cacheService.set('groups', [], {expires: Date.now() - 1});

    return this.http
    .delete(
      this.baseURL+group.id,
      options
    )
    .map(res => {
      return res;
    });
  }

  editGroup(group){
    const headers = new Headers({'Content-Type': 'application/json', 'Access-Control-Allow-Origin': 'localhost:4200', 'Authorization': localStorage.getItem('auth_token')});
    const options = new RequestOptions({headers: headers});

    this._cacheService.set('groups', [], {expires: Date.now() - 1});
    this._cacheService.set('users', [], {expires: Date.now() - 1});
    debugger;
    return this.http
    .put(
      this.baseURL+group.id,
      {"course_id":group.course_id,"enrollments":group.enrollments,"period":group.period,"professor_id":group.professor},
      options
    )
    .map(res => {
      return res;
    });
  }
}
