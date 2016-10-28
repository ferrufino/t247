import {Injectable} from '@angular/core';
import {Http, Response, Headers} from "@angular/http";
import {environment} from '../../environments/environment';
import { CacheService, CacheStoragesEnum } from 'ng2-cache/ng2-cache';

@Injectable()
export class GroupsService {

  private baseURL: string = environment.apiURL + '/groups/';

  private createUrl = this.baseURL+'create';

  private headers = new Headers({'Content-Type': 'application/json'});

  constructor(private http: Http, private _cacheService: CacheService) {
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
