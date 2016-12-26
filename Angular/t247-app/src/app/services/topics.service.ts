import '../rxjs-operators';
import 'rxjs/add/operator/map';
import {Injectable} from '@angular/core';
import {Headers, Http, Response, RequestOptions} from '@angular/http';
import {environment} from '../../environments/environment';

import {CacheService} from 'ng2-cache/src/services/cache.service';

// import { Observable }     from 'rxjs/Observable';
@Injectable()
export class TopicsService {

  private getUrl = environment.apiURL + '/topics/';

  private editUrl = environment.apiURL + '/topics/';

  private deleteUrl = environment.apiURL + '/topics/';

  private createUrl = environment.apiURL + '/topics/create';

  constructor(private http: Http, private _cacheService: CacheService) {
  }

  editTopic(topic) {
    const headers = new Headers({'Content-Type': 'application/json', 'Access-Control-Allow-Origin': 'localhost:4200', 'Authorization': localStorage.getItem('auth_token')});
    const options = new RequestOptions({headers: headers});

    this._cacheService.set('topics', [], {expires: Date.now() - 1});
    console.log("Caching borrado");
    return this.http
      .put(
        this.editUrl + topic.id,
        {"name": topic.name},
        options
      )
      .map(res => {
        return res;
      });
  }

  deleteTopic(topic) {
    const headers = new Headers({'Content-Type': 'application/json', 'Access-Control-Allow-Origin': 'localhost:4200', 'Authorization': localStorage.getItem('auth_token')});
    const options = new RequestOptions({headers: headers});

    this._cacheService.set('topics', [], {expires: Date.now() - 1});
    return this.http
      .delete(
        this.deleteUrl + topic.id,
        options
      )
      .map(res => {
        return res;
      });
  }

  createTopic(topicName) {
    const headers = new Headers({'Content-Type': 'application/json', 'Access-Control-Allow-Origin': 'localhost:4200', 'Authorization': localStorage.getItem('auth_token')});
    const options = new RequestOptions({headers: headers});

    this._cacheService.set('topics', [], {expires: Date.now() - 1});
    return this.http
      .post(
        this.createUrl,
        {"name": topicName},
        options
      )
      .map(res => {
        return res;
      });
  }

  getTopic(id) {
    const headers = new Headers({'Content-Type': 'application/json', 'Access-Control-Allow-Origin': 'localhost:4200', 'Authorization': localStorage.getItem('auth_token')});
    const options = new RequestOptions({headers: headers});

    return this.http
      .get(
        this.getUrl + id, options
      )
      .map((response: Response) => response.json());
  }

  getTopics() {
    const headers = new Headers({'Content-Type': 'application/json', 'Access-Control-Allow-Origin': 'localhost:4200', 'Authorization': localStorage.getItem('auth_token')});
    const options = new RequestOptions({headers: headers});

    const serviceURL: string = environment.apiURL + '/topics/';
    return this.http.get(serviceURL, options).map((response: Response) => response.json());
  }
}
