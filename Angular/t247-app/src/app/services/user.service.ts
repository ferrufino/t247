/**
 * Created by iker arbulu on 02/10/16.
 */

 import '../rxjs-operators';
 import 'rxjs/add/operator/map';
import {Injectable} from '@angular/core';
import { Headers, Http, Response, RequestOptions } from '@angular/http';
import {User} from '../user';
// import { Observable }     from 'rxjs/Observable';
@Injectable()
export class UserService {

  private editUrl = 'http://localhost:5000/api/users/';

  private headers = new Headers({'Content-Type': 'application/json'});

    constructor( private http: Http){
        }

    editUser(user){
      return this.http
      .put(
        this.editUrl+user.id,
        {"first_name":user.first_name,"last_name":user.last_name,"enrollment":user.enrollment},
        this.headers
      )
      .map(res => res.json());
    }
}
