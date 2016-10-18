import { Injectable } from '@angular/core';
import { Http, Response } from "@angular/http";

@Injectable()
export class HttpTableService {

  constructor(private http: Http) { }

  getCourses() {
    const serviceURL : string = 'http://107.170.255.106:5000/api/courses/';
    return this.http.get(serviceURL).map((response: Response) => response.json());
  }

}
