import {Injectable} from '@angular/core';
import {Http, Response, Headers, RequestOptions} from "@angular/http";
import {environment} from '../../environments/environment';

import {CacheService} from 'ng2-cache/src/services/cache.service';

@Injectable()
export class GroupsService {

  private baseURL: string = environment.apiURL + '/groups/';

  private createUrl = this.baseURL+'create';

  private headers = new Headers({'Content-Type': 'application/json', 'Authorization': localStorage.getItem('auth_token')});

  private options = new RequestOptions({headers: this.headers});

  constructor(private http: Http, private _cacheService: CacheService) {
  }

  getGroups() {
    return this.http.get(this.baseURL, this.options).map((response: Response) => response.json());
  }

  getGroup(id) {
    return this.http
      .get(
        this.baseURL + id, this.options
      )
      .map((response: Response) => response.json());
  }

  createGroup(group){
    this._cacheService.set('groups', [], {expires: Date.now() - 1});
    this._cacheService.set('users', [], {expires: Date.now() - 1});
    return this.http
    .post(
      this.createUrl,
      {"course_id":group.courseId,"enrollments":group.enrollments,"period":group.period,"professor_id":group.professor},
      this.headers
    )
    .map(res => {
      return res;
    });
  }

  deleteGroup(group){
    this._cacheService.set('groups', [], {expires: Date.now() - 1});
    return this.http
    .delete(
      this.baseURL+group.id,
      this.headers
    )
    .map(res => {
      return res;
    });
  }

  editGroup(group){
    this._cacheService.set('groups', [], {expires: Date.now() - 1});
    this._cacheService.set('users', [], {expires: Date.now() - 1});
    return this.http
    .put(
      this.baseURL+group.id,
      {"course_id":group.courseId,"enrollments":group.enrollments,"period":group.period,"professor_id":group.professor},
      this.headers
    )
    .map(res => {
      return res;
    });
  }
}
