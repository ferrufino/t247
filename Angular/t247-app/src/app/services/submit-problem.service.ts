import { Injectable } from '@angular/core';
import '../rxjs-operators';
import 'rxjs/add/operator/map';
import { Headers, Http, Response, RequestOptions } from '@angular/http';

@Injectable()
export class SubmitProblemService{

  private headers = new Headers({'Content-Type': 'application/json', 'Access-Control-Allow-Origin': 'localhost:4200', 'Authorization': localStorage.getItem('auth_token')});
  private options = new RequestOptions({headers: this.headers});

    constructor(private http:Http) {
    }


    getDescriptions(id) {
        const headers = new Headers({'Content-Type': 'application/json', 'Access-Control-Allow-Origin': 'localhost:4200', 'Authorization': localStorage.getItem('auth_token')});
        const options = new RequestOptions({headers: headers});

        const serviceURL:string = 'http://107.170.255.106:5000/api/problems/description/'+id;
        return this.http.get(serviceURL, options).map((response:Response) => response.json());
    }

    getAttempts(s_id, id) {
        const headers = new Headers({'Content-Type': 'application/json', 'Access-Control-Allow-Origin': 'localhost:4200', 'Authorization': localStorage.getItem('auth_token')});
        const options = new RequestOptions({headers: headers});

        const serviceURL:string = 'http://107.170.255.106:5000/api/submissions/last/'+s_id+'/'+id+'/0';
        return this.http.get(serviceURL, options).map((response:Response) => response.json());
    }

    getSubmissions(id) {

        const headers = new Headers({'Content-Type': 'application/json', 'Access-Control-Allow-Origin': 'localhost:4200', 'Authorization': localStorage.getItem('auth_token')});
        const options = new RequestOptions({headers: headers});
        console.log("HEADER-SUBMISSIONS");
        console.log(options);

        const serviceURL:string = 'http://107.170.255.106:5000/api/submissions/attempts/'+id;
        return this.http.get(serviceURL, options).map((response:Response) => response.json());
    }
}
