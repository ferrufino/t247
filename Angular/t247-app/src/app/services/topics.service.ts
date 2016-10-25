import { Injectable } from '@angular/core';
import { Http, Response } from "@angular/http";

@Injectable()
export class TopicsService {

  constructor(private http: Http) { }

  getTopics() {
    const serviceURL : string = 'http://107.170.255.106:5000/api/topics/';
    return this.http.get(serviceURL).map((response: Response) => response.json());
/*    if(!this._topics){
      this._topics = this.http.get(serviceURL)
        .map((response: Response) => response.json())
        .do(topics => console.log('fetched friends'))
        .publishReplay(1)
        .refCount();
    }
    return this._topics  */
  }

}
