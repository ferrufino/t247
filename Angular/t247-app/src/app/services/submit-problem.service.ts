import { Injectable } from '@angular/core';

import '../rxjs-operators';
import 'rxjs/add/operator/map';
import { Headers, Http, Response, RequestOptions } from '@angular/http';

@Injectable()
export class SubmitProblemService{
    constructor(private http:Http) {
    }


    getDescriptions() {
        const serviceURL:string = 'http://107.170.255.106:5000/api/problems/description/13';
        return this.http.get(serviceURL).map((response:Response) => response.json());
    }

    getAttempts() {
        const serviceURL:string = 'http://107.170.255.106:5000/api/submissions/last/5/13/0';
        return this.http.get(serviceURL).map((response:Response) => response.json());
    }

    getSubmissions() {
        const serviceURL:string = 'http://107.170.255.106:5000/api/submissions/attempts/5';
        return this.http.get(serviceURL).map((response:Response) => response.json());
    }
}