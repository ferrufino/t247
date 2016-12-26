import { Injectable } from '@angular/core';
import '../rxjs-operators';
import 'rxjs/add/operator/map';
import { Headers, Http, Response, RequestOptions } from '@angular/http';
import {environment} from '../../environments/environment';

@Injectable()
export class SubmitProblemService{

    constructor(private http:Http) {
    }


    getDescriptions(id) {
        const headers = new Headers({'Content-Type': 'application/json', 'Access-Control-Allow-Origin': 'localhost:4200', 'Authorization': localStorage.getItem('auth_token')});
        const options = new RequestOptions({headers: headers});

        const serviceURL:string = environment.apiURL + '/problems/description/'+id;
        return this.http.get(serviceURL, options).map((response:Response) => response.json());
    }

    getAttempts(s_id, id) {
        const headers = new Headers({'Content-Type': 'application/json', 'Access-Control-Allow-Origin': 'localhost:4200', 'Authorization': localStorage.getItem('auth_token')});
        const options = new RequestOptions({headers: headers});

        const serviceURL:string = environment.apiURL + '/submissions/last/'+s_id+'/'+id+'/0';
        return this.http.get(serviceURL, options).map((response:Response) => response.json());
    }

    getSubmissions(id) {
        const headers = new Headers({'Content-Type': 'application/json', 'Access-Control-Allow-Origin': 'localhost:4200', 'Authorization': localStorage.getItem('auth_token')});
        const options = new RequestOptions({headers: headers});

        const serviceURL:string = environment.apiURL + '/submissions/attempts/'+id+'/';
        return this.http.get(serviceURL, options).map((response:Response) => response.json());

    }
}
