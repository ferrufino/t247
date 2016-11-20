import '../rxjs-operators';
import 'rxjs/add/operator/map';
import {Injectable} from '@angular/core';
import {Headers, Http, Response, RequestOptions} from '@angular/http';

import {CacheService} from 'ng2-cache/src/services/cache.service';

// import { Observable }     from 'rxjs/Observable';
@Injectable()
export class TopicsService {

  private getUrl = 'http://107.170.255.106:5000/api/topics/';

  private editUrl = 'http://107.170.255.106:5000/api/topics/';

  private deleteUrl = 'http://107.170.255.106:5000/api/topics/';

  private createUrl = 'http://107.170.255.106:5000/api/topics/create';

  private headers = new Headers({'Content-Type': 'application/json', 'Authorization': localStorage.getItem('auth_token')});
  private options = new RequestOptions({headers: this.headers});

  constructor(private http: Http, private _cacheService: CacheService) {
  }

  editTopic(topic) {
    this._cacheService.set('topics', [], {expires: Date.now() - 1});
    console.log("Caching borrado");
    return this.http
      .put(
        this.editUrl + topic.id,
        {"name": topic.name},
        this.headers
      )
      .map(res => {
        return res;
      });
  }

  deleteTopic(topic) {
    this._cacheService.set('topics', [], {expires: Date.now() - 1});
    return this.http
      .delete(
        this.deleteUrl + topic.id,
        this.headers
      )
      .map(res => {
        return res;
      });
  }

  createTopic(topicName) {
    this._cacheService.set('topics', [], {expires: Date.now() - 1});
    return this.http
      .post(
        this.createUrl,
        {"name": topicName},
        this.headers
      )
      .map(res => {
        return res;
      });
  }

  getTopic(id) {
    return this.http
      .get(
        this.getUrl + id, this.options
      )
      .map((response: Response) => response.json());
  }

  getTopics() {
    const serviceURL: string = 'http://107.170.255.106:5000/api/topics/';
    return this.http.get(serviceURL, this.options).map((response: Response) => response.json());
  }
}
