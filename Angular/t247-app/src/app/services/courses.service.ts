import '../rxjs-operators';
import 'rxjs/add/operator/map';
import {Injectable} from '@angular/core';
import { Headers, Http, Response, RequestOptions } from '@angular/http';
// import { Observable }     from 'rxjs/Observable';
@Injectable()
export class CoursesService {

  private editUrl = 'http://cors.io/?http://107.170.255.106:5000/api/courses/';

  private deleteUrl = 'http://cors.io/?http://107.170.255.106:5000/api/courses/';

  private createUrl = 'http://cors.io/?http://107.170.255.106:5000/api/courses/create';

  private headers = new Headers({'Content-Type': 'application/json'});

    constructor( private http: Http){
        }

    editCourse(course){
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
      return this.http
      .delete(
        this.deleteUrl+course.id,
        this.headers
      )
      .map(res => {
        return res;
      });
    }

    createTopic(course){
      return this.http
      .post(
        this.createUrl,
        {"name":course.name},
        this.headers
      )
      .map(res => {
        return res;
      });
    }
}
