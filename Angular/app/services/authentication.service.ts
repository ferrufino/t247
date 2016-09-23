/**
 * Created by ahinojosa on 13/09/16.
 */

import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {Http, Response} from '@angular/http';
import {Headers, RequestOptions} from '@angular/http';
import { Observable }     from 'rxjs/Observable';

export class User {
    constructor(
        public email: string,
        public password: string) { }
}

var users = [
    new User('admin@admin.com','admin'),
    new User('root@gmail.com','root')
];

@Injectable()
export class AuthenticationService {

    constructor(
        private _router: Router,
        private http: Http){}

    private loginUrl = 'localhost:5000/api/users/login';
    private headers = new Headers({'Content-Type': 'application/json'});

    logout() {
        localStorage.removeItem("user");
        this._router.navigate(['login']);
    }

    login(user){
        var authenticationTry = this.http
                .post(this.loginUrl, JSON.stringify({email:user.email,password:user.password}), {headers: this.headers})
               .toPromise()
               .then(response => response.json().data)
               .catch(this.handleError);
      if(authenticationTry.token!=undefined){
        sessionStorage.setItem("user",JSON.stringify(authenticationTry));
        this._router.navigate(['']);
        return true;
      }
      return false;

    }

    checkCredentials(){
        if (localStorage.getItem("user") === null){
            this._router.navigate(['login']);
        }
    }

    handleError(error : any) {
        let errMsg = (error.message) ? error.message :
        error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        console.error(errMsg); // log to console instead
        //return Observable.throw(errMsg);
  }
}

