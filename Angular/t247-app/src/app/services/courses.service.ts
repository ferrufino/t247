import { Injectable } from '@angular/core';

import '../rxjs-operators';
import 'rxjs/add/operator/map';
import { Headers, Http, Response, RequestOptions } from '@angular/http';
import {environment} from '../../environments/environment';

import {CacheService} from 'ng2-cache/src/services/cache.service';

@Injectable()
export class CoursesService {

  constructor(private http: Http, private _cacheService: CacheService) { }

  private getUrl = environment.apiURL + '/courses/';

  private editUrl = environment.apiURL + '/courses/';

  private deleteUrl = environment.apiURL + '/courses/';

  private createUrl = environment.apiURL + '/courses/create';

    // TODO BIEN
    editCourse(course){

      const headers = new Headers({'Content-Type': 'application/json', 'Access-Control-Allow-Origin': 'localhost:4200', 'Authorization': localStorage.getItem('auth_token')});
      const options = new RequestOptions({headers: headers});

      this._cacheService.set('courses', [], {expires: Date.now() - 1});
      return this.http
      .put(
        this.editUrl+course.id,
        {"name":course.name},
        options
      )
      .map(res => {
        return res;
      });
    }

    // TODO BIEN
    deleteCourse(course){

      const headers = new Headers({'Content-Type': 'application/json', 'Access-Control-Allow-Origin': 'localhost:4200', 'Authorization': localStorage.getItem('auth_token')});
      const options = new RequestOptions({headers: headers});

      this._cacheService.set('courses', [], {expires: Date.now() - 1});
      return this.http
      .delete(
        this.deleteUrl+course.id,
        options
      )
      .map(res => {
        return res;
      });
    }

    // TODO BIEN
    createCourse(courseName){

      const headers = new Headers({'Content-Type': 'application/json', 'Access-Control-Allow-Origin': 'localhost:4200', 'Authorization': localStorage.getItem('auth_token')});
      const options = new RequestOptions({headers: headers});

      this._cacheService.set('courses', [], {expires: Date.now() - 1});
      return this.http
      .post(
        this.createUrl,
        {"name":courseName},
        options
      )
      .map(res => {
        return res;
      });
    }

    // TODO BIEN
    getCourse(id){
      const headers = new Headers({'Content-Type': 'application/json', 'Access-Control-Allow-Origin': 'localhost:4200', 'Authorization': localStorage.getItem('auth_token')});
      const options = new RequestOptions({headers: headers});

      return this.http
      .get(
        this.getUrl+id, options
      )
      .map((response: Response) => response.json());
    }

  getCourses() {
    const headers = new Headers({'Content-Type': 'application/json', 'Access-Control-Allow-Origin': 'localhost:4200', 'Authorization': localStorage.getItem('auth_token')});
    const options = new RequestOptions({headers: headers});
    const serviceURL : string = environment.apiURL + '/courses/';
    return this.http.get(serviceURL, options).map((response: Response) => response.json());
  }

}
