import {Injectable} from '@angular/core';
import {Http, Response, Headers, RequestOptions} from "@angular/http";
import 'rxjs/Rx';
import {Observable} from "rxjs/Rx";
import {environment} from "../../environments/environment";

export class ProgLanguage {
    constructor(public name:string,
                public value:string,
                public extension:string) {
    }
}

@Injectable()
export class SupportedLanguages {

    constructor(private http:Http) {
    }

    private GET_LANGUAGES_URL:string = environment.apiURL + "/languages/";

    /**
     * This function returns an array of objects of type Language
     * The languages returned from this service are the ones that are supported by the evaluator
     * @returns {Observable<R>}
     */
    getLanguages() {
        const headers = new Headers({'Content-Type': 'application/json', 'Access-Control-Allow-Origin': 'localhost:4200', 'Authorization': localStorage.getItem('auth_token')});
        const options = new RequestOptions({headers: headers});

        return this.http.get(this.GET_LANGUAGES_URL, options)
            .map((response:Response) => response.json());
    }


}
