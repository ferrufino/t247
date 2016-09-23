/**
 * Created by ahinojosa on 13/09/16.
 */

import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';

import { Headers, Http } from '@angular/http';


import { InMemoryDbService } from 'angular2-in-memory-web-api';
export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    let heroes = [
      {id: 11, name: 'Mr. Nice'},
      {id: 12, name: 'Narco'},
      {id: 13, name: 'Bombasto'},
      {id: 14, name: 'Celeritas'},
      {id: 15, name: 'Magneta'},
      {id: 16, name: 'RubberMan'},
      {id: 17, name: 'Dynama'},
      {id: 18, name: 'Dr IQ'},
      {id: 19, name: 'Magma'},
      {id: 20, name: 'Tornado'}
    ];
    return {heroes};
  }
}

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

  private loginUrl = 'http://localhost:5000/api/login';

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
        JSON.stringify({ email:user.email, password:user.password }),
        this.headers
      )
      .map(res => res.json())
      .map((res) => {
        if (res.success) {
          sessionStorage.setItem('auth_token', res.auth_token);
          sessionStorage.setItem('email_user',user.email);
          this.loggedIn = true;
        }

        return res.success;
      });
    }

    checkCredentials(){
      if (!this.loggedIn){
        this._router.navigate(['login']);
      }
    }
}
