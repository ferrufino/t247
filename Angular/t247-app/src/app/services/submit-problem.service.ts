import { Injectable } from '@angular/core';
import '../rxjs-operators';
import 'rxjs/add/operator/map';
import { Headers, Http, Response, RequestOptions } from '@angular/http';

@Injectable()
export class SubmitProblemService{

  private headers = new Headers({'Content-Type': 'application/json', 'Authorization': localStorage.getItem('auth_token')});
  private options = new RequestOptions({headers: this.headers});

    constructor(private http:Http) {
    }


    getDescriptions(id) {
        const serviceURL:string = 'http://107.170.255.106:5000/api/problems/description/'+id;
        return this.http.get(serviceURL, this.options).map((response:Response) => response.json());
    }

    getAttempts(s_id, id) {
        const serviceURL:string = 'http://107.170.255.106:5000/api/submissions/last/'+s_id+'/'+id+'/0';
        return this.http.get(serviceURL, this.options).map((response:Response) => response.json());
    }

    getSubmissions(id) {
        const serviceURL:string = 'http://107.170.255.106:5000/api/submissions/attempts/'+id;
        return this.http.get(serviceURL, this.options).map((response:Response) => response.json());
    }
}
