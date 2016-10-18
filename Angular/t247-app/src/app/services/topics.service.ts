import '../rxjs-operators';
import 'rxjs/add/operator/map';
import {Injectable} from '@angular/core';
import { Headers, Http, Response, RequestOptions } from '@angular/http';
// import { Observable }     from 'rxjs/Observable';
@Injectable()
export class TopicsService {

  private editUrl = 'http://cors.io/?http://107.170.255.106:5000/api/topics/';

  private deleteUrl = 'http://cors.io/?http://107.170.255.106:5000/api/topics/';

  private createUrl = 'http://cors.io/?http://107.170.255.106:5000/api/topics/create';

  private headers = new Headers({'Content-Type': 'application/json'});

    constructor( private http: Http){
        }

    editTopic(topic){
      return this.http
      .put(
        this.editUrl+topic.id,
        {"name":topic.name},
        this.headers
      )
      .map(res => {
        return res;
      });
    }

    deleteTopic(topic){
      return this.http
      .delete(
        this.deleteUrl+topic.id,
        this.headers
      )
      .map(res => {
        return res;
      });
    }

    createTopic(topic){
      return this.http
      .post(
        this.createUrl,
        {"name":topic.name},
        this.headers
      )
      .map(res => {
        return res;
      });
    }
}
