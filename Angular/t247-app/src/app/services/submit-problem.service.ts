import { Injectable } from '@angular/core';

import '../rxjs-operators';
import 'rxjs/add/operator/map';
import { Headers, Http, Response, RequestOptions } from '@angular/http';

@Injectable()
export class SubmitProblemService{
    constructor(private http:Http) {
    }


    getDescriptions(id) {
        const serviceURL:string = 'http://107.170.255.106:5000/api/problems/description/'+id;
        return this.http.get(serviceURL).map((response:Response) => response.json());
    }

    getAttempts(s_id, id) {
        const serviceURL:string = 'http://107.170.255.106:5000/api/submissions/last/'+s_id+'/'+id+'/0';
        return this.http.get(serviceURL).map((response:Response) => response.json());
    }

    getSubmissions() {
        const serviceURL:string = 'http://107.170.255.106:5000/api/submissions/attempts/4';
        return this.http.get(serviceURL).map((response:Response) => response.json());
    }
}
