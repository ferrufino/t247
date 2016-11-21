import { Injectable } from '@angular/core';

import '../rxjs-operators';
import 'rxjs/add/operator/map';
import { Headers, Http, Response, RequestOptions } from '@angular/http';

import {CacheService} from 'ng2-cache/src/services/cache.service';

@Injectable()
export class CoursesService {

  constructor(private http: Http, private _cacheService: CacheService) { }

  private getUrl = 'http://107.170.255.106:5000/api/courses/';

  private editUrl = 'http://107.170.255.106:5000/api/courses/';

  private deleteUrl = 'http://107.170.255.106:5000/api/courses/';

  private createUrl = 'http://107.170.255.106:5000/api/courses/create';

  private headers = new Headers({'Content-Type': 'application/json', 'Access-Control-Allow-Origin': 'localhost:4200', 'Authorization': localStorage.getItem('auth_token')});

  private options = new RequestOptions({headers: this.headers});

    editCourse(course){
      this._cacheService.set('courses', [], {expires: Date.now() - 1});
      return this.http
      .put(
        this.editUrl+course.id,
        {"name":course.name},
        this.headers
      )
      .map(res => {
        return res;
      });
    }

    deleteCourse(course){
      this._cacheService.set('courses', [], {expires: Date.now() - 1});
      return this.http
      .delete(
        this.deleteUrl+course.id,
        this.headers
      )
      .map(res => {
        return res;
      });
    }

    createCourse(courseName){
      this._cacheService.set('courses', [], {expires: Date.now() - 1});
      return this.http
      .post(
        this.createUrl,
        {"name":courseName},
        this.headers
      )
      .map(res => {
        return res;
      });
    }

    getCourse(id){
      return this.http
      .get(
        this.getUrl+id, this.options
      )
      .map((response: Response) => response.json());
    }

  getCourses() {
    const serviceURL : string = 'http://107.170.255.106:5000/api/courses/';
    return this.http.get(serviceURL, this.options).map((response: Response) => response.json());
  }

}
