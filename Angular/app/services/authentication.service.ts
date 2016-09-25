/**
 * Created by ahinojosa on 13/09/16.
 */

 import '../rxjs-operators';
 import 'rxjs/add/operator/map';
import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import { Headers, Http, Response, RequestOptions } from '@angular/http';
// import { Observable }     from 'rxjs/Observable';

export class User {
    constructor(
        public email?: string,
        public password?: string,
        public roles?: [string],
        public token?: string) { }
}

var users = [
    new User('admin@admin.com','admin',['admin','prof','user']),
    new User('root@gmail.com','root',['user'])
];

@Injectable()
export class AuthenticationService {

  private loggedIn = false;

  private loginUrl = 'http://localhost:5000/api/users/login';

  private headers = new Headers({'Content-Type': 'application/json'});

    constructor(
        private _router: Router, private http: Http){
          this.loggedIn = !!sessionStorage.getItem('auth_token');
        }

    logout() {
        sessionStorage.removeItem("email_user")
        sessionStorage.removeItem("auth_token");
        this.loggedIn = false;
        this._router.navigate(['login']);
    }

    login(user){
      return this.http
      .post(
        this.loginUrl,
        { "email":user.email, "password":user.password },
        this.headers
      )
      .map(res => res.json())
      .map((res) => {
        if (res.token) {
          sessionStorage.setItem('auth_token', res.token);
          sessionStorage.setItem('email_user',user.email);
          this.loggedIn = true;
        }

        return res.token;
      });
    }

    checkCredentials(){
      if (!this.loggedIn){
        this._router.navigate(['login']);
      }
    }
}
