import {Injectable} from '@angular/core';
import {Http, Response, Headers} from "@angular/http";
import 'rxjs/Rx';
import {Observable} from "rxjs/Rx";
import {environment} from "../../environments/environment";
// TODO: DEPRECATED DELETE THIS SERVICE

export class ProgLanguage {
  constructor(public name: string,
              public value: string,
              public extension: string) {
  }
}

@Injectable()
export class SupportedLanguages {

  constructor(private http: Http) {
  }

  private GET_LANGUAGES_URL: string = environment.apiURL + "/languages";

  /**
   * This function returns an array of objects of type Language
   * The languages returned from this service are the ones that are supported by the evaluator
   * @returns {Observable<R>}
   */
  getLanguages() {
    return this.http.get(this.GET_LANGUAGES_URL)
      .map((response: Response) => response.json());
  }

}
