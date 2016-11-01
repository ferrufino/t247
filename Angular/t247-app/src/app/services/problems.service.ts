import { Injectable } from '@angular/core';

import '../rxjs-operators';
import 'rxjs/add/operator/map';
import { Headers, Http, Response, RequestOptions } from '@angular/http';


@Injectable()
export class ProblemsService {
    constructor(private http:Http) {
        
    }
    
    getProblems(){
        const serviceURL:string = 'http://107.170.255.106:5000/api/problems/';
        return this.http.get(serviceURL).map((response:Response) => response.json());

    }

}
