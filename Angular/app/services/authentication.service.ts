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
        public role?: [string],
        public token?: string) { }
}

@Injectable()
export class AuthenticationService {

  private loggedIn = false;

  private loginUrl = 'http://localhost:5000/api/users/login';

  private rolesUrl = 'http://localhost:5000/api/users/role';

  private headers = new Headers({'Content-Type': 'application/json'});

    constructor(
        private _router: Router, private http: Http){
          this.loggedIn = !!sessionStorage.getItem('auth_token');
        }

    logout() {
      //TODO: Checa si vamos a mandar la acción de logout al api
        sessionStorage.removeItem("email_user");
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
          let roles = ['student'];
          if(res.role === 'admin'){
            roles.push('admin','professor');
          }
          else if(res.role === 'professor'){
            roles.push('professor');
          }
          sessionStorage.setItem('roles',JSON.stringify(roles));
          this.loggedIn = true;
          this._router.navigate(['']);
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
