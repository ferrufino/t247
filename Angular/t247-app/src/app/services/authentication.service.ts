import '../rxjs-operators';
import 'rxjs/add/operator/map';
import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import { Headers, Http, Response, RequestOptions } from '@angular/http';
import {User} from '../user';
// import { Observable }     from 'rxjs/Observable';
@Injectable()
export class AuthenticationService {

  private loggedIn = false;

  private loginUrl = 'http://107.170.255.106:5000/api/users/login';
  private logoutUrl = 'http://107.170.255.106:5000/api/users/logout';

  private rolesUrl = 'http://107.170.255.106:5000/api/users/role';

  private headers = new Headers({'Content-Type': 'application/json'});

    constructor(
        private _router: Router, private http: Http){
          this.loggedIn = !!sessionStorage.getItem('auth_token');
        }

    logout() {
        this.request_logout().subscribe(
            data => {
                console.log(data)
                
            });
        sessionStorage.removeItem("email_user");
        sessionStorage.removeItem("auth_token");
        sessionStorage.removeItem("userJson");
        localStorage.removeItem("email_user");
        localStorage.removeItem("auth_token");
        localStorage.removeItem("userJson");
        this.loggedIn = false;
        this._router.navigate(['/login']);
    }

    request_logout() {
        let body = {"token":sessionStorage.getItem("auth_token")};
        let options = new RequestOptions({ headers: this.headers });
        return this.http.post(this.logoutUrl, body, this.headers)
            .map((data: Response) => data.json());
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
            sessionStorage.setItem('userJson',JSON.stringify(new User(user.email,res.id,res.name,res.lastName,res.enrollment)));
            sessionStorage.setItem('auth_token', res.token);
            sessionStorage.setItem('email_user',user.email);
            res.role = 'admin';
            let roles = ['student'];
            if(res.role == 'admin'){
            roles.push('admin','professor');
            }
            else if(res.role == 'professor'){
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
